import { Injectable } from '@nestjs/common';
import { MigrationLogRepositoryPort } from '../../domain/ports/migration-log.repository.port';
import { TransactionRepositoryPort } from '../../../transaction/domain/ports/transaction.repository.port';
import { ExportApiRepositoryPort } from '../../../export-api/domain/ports/export-api.repository.port';
import { ImportApiRepositoryPort } from '../../../import-api/domain/ports/import-api.repository.port';
import { HttpClientService } from '../../../../shared/services/http-client.service';
import { FieldMapperService } from '../../../../shared/services/field-mapper.service';

@Injectable()
export class RetryFailedUseCase {
  constructor(
    private readonly logRepo: MigrationLogRepositoryPort,
    private readonly transactionRepo: TransactionRepositoryPort,
    private readonly exportApiRepo: ExportApiRepositoryPort,
    private readonly importApiRepo: ImportApiRepositoryPort,
    private readonly httpClient: HttpClientService,
    private readonly fieldMapper: FieldMapperService,
  ) {}

  async execute(): Promise<{ retried: number; recovered: number; stillFailed: number }> {
    const failedLogs = await this.logRepo.findFailed();

    let retried = 0;
    let recovered = 0;
    let stillFailed = 0;

    for (const log of failedLogs) {
      if (log.retryCount >= log.maxRetries) {
        stillFailed++;
        continue;
      }

      const transaction = await this.transactionRepo.findById(log.transactionId);
      if (!transaction) { stillFailed++; continue; }

      const exportConfig = await this.exportApiRepo.findById(transaction.exportApiId);
      const importConfig = await this.importApiRepo.findById(transaction.importApiId);
      if (!exportConfig || !importConfig) { stillFailed++; continue; }

      retried++;

      try {
        const converted = this.fieldMapper.map(
          log.sourceData as Record<string, unknown>,
          transaction.fieldMapping,
        );
        await this.httpClient.send(importConfig, converted);
        await this.logRepo.updateRetry(log.id, log.retryCount + 1, 'success', new Date());
        recovered++;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        const newCount = log.retryCount + 1;
        const newStatus = newCount >= log.maxRetries ? 'failed' : 'retrying';
        await this.logRepo.updateRetry(log.id, newCount, newStatus, new Date(), message);
        stillFailed++;
      }
    }

    return { retried, recovered, stillFailed };
  }
}
