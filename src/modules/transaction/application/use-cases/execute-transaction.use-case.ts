import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';
import { ExportApiRepositoryPort } from '../../../export-api/domain/ports/export-api.repository.port';
import { ImportApiRepositoryPort } from '../../../import-api/domain/ports/import-api.repository.port';
import { MigrationLogRepositoryPort } from '../../../migration-log/domain/ports/migration-log.repository.port';
import { HttpClientService } from '../../../../shared/services/http-client.service';
import { FieldMapperService } from '../../../../shared/services/field-mapper.service';

const MAX_RETRIES = 3;

@Injectable()
export class ExecuteTransactionUseCase {
  constructor(
    private readonly transactionRepo: TransactionRepositoryPort,
    private readonly exportApiRepo: ExportApiRepositoryPort,
    private readonly importApiRepo: ImportApiRepositoryPort,
    private readonly migrationLogRepo: MigrationLogRepositoryPort,
    private readonly httpClient: HttpClientService,
    private readonly fieldMapper: FieldMapperService,
  ) {}

  async execute(transactionId: string): Promise<{ success: number; failed: number }> {
    const transaction = await this.transactionRepo.findById(transactionId);
    if (!transaction) throw new NotFoundException(`Transaction ${transactionId} não encontrada`);

    const exportConfig = await this.exportApiRepo.findById(transaction.exportApiId);
    if (!exportConfig)
      throw new NotFoundException(`ExportApiConfig ${transaction.exportApiId} não encontrada`);

    const importConfig = await this.importApiRepo.findById(transaction.importApiId);
    if (!importConfig)
      throw new NotFoundException(`ImportApiConfig ${transaction.importApiId} não encontrada`);

    await this.transactionRepo.updateStatus(transaction.id, 'running');

    const processRecords = async (records: Record<string, unknown>[]) => {
      for (const record of records) {
        // 2. Verificar compatibilidade
        const { compatible, missingFields } = this.fieldMapper.checkCompatibility(
          record,
          transaction.fieldMapping,
        );

        if (!compatible) {
          await this.migrationLogRepo.create({
            transactionId: transaction.id,
            status: 'failed',
            sourceData: record,
            error: `Campos ausentes no registro: ${missingFields.join(', ')}`,
            retryCount: 0,
            maxRetries: MAX_RETRIES,
          });
          failedCount++;
          continue;
        }

        try {
          // 3. Converter / mapear campos
          const converted = this.fieldMapper.map(record, transaction.fieldMapping);

          // 4. Enviar para a API de importação
          await this.httpClient.send(importConfig, converted);

          await this.migrationLogRepo.create({
            transactionId: transaction.id,
            status: 'success',
            sourceData: record,
            convertedData: converted,
            retryCount: 0,
            maxRetries: MAX_RETRIES,
          });

          successCount++;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);

          // 5. Falhou → salva no banco local como cache para retry
          await this.migrationLogRepo.create({
            transactionId: transaction.id,
            status: 'failed',
            sourceData: record,
            error: message,
            retryCount: 0,
            maxRetries: MAX_RETRIES,
          });
          failedCount++;
        }
      }
    };

    let successCount = 0;
    let failedCount = 0;

    try {
      if (exportConfig.pagination) {
        await this.httpClient.fetchPages(exportConfig, processRecords);
      } else {
        const raw = await this.httpClient.fetch(exportConfig);
        const sourceRecords = Array.isArray(raw) ? raw : [raw as Record<string, unknown>];
        await processRecords(sourceRecords);
      }
    } catch (err: unknown) {
      await this.transactionRepo.updateStatus(transaction.id, 'failed', new Date());
      throw err;
    }

    const finalStatus =
      failedCount === 0 ? 'completed' : successCount === 0 ? 'failed' : 'partial';
    await this.transactionRepo.updateStatus(transaction.id, finalStatus, new Date());

    return { success: successCount, failed: failedCount };
  }
}
