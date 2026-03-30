import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';
import { ExportApiRepositoryPort } from '../../../export-api/domain/ports/export-api.repository.port';
import { ImportApiRepositoryPort } from '../../../import-api/domain/ports/import-api.repository.port';
import { FieldMapperService } from '../../../../shared/services/field-mapper.service';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { Transaction } from '../../domain/entities/transaction.entity';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly repository: TransactionRepositoryPort,
    private readonly exportApiRepo: ExportApiRepositoryPort,
    private readonly importApiRepo: ImportApiRepositoryPort,
    private readonly fieldMapper: FieldMapperService,
  ) {}

  async execute(dto: CreateTransactionDto): Promise<Transaction> {
    const exportConfig = await this.exportApiRepo.findById(dto.exportApiId);
    if (!exportConfig)
      throw new NotFoundException(`ExportApiConfig ${dto.exportApiId} não encontrada`);

    const importConfig = await this.importApiRepo.findById(dto.importApiId);
    if (!importConfig)
      throw new NotFoundException(`ImportApiConfig ${dto.importApiId} não encontrada`);

    const { fieldMapping, unmatched } = this.fieldMapper.autoMap(
      exportConfig.dtoSample,
      importConfig.dtoSample,
      dto.manualMappings,
    );

    if (unmatched.exportKeys.length > 0 || unmatched.importKeys.length > 0) {
      throw new BadRequestException({
        message:
          'Existem campos sem mapeamento entre os dois DTOs. Forneça manualMappings para conectá-los.',
        unmatched,
        suggestion: `Indique via manualMappings: exportKeys [${unmatched.exportKeys.join(', ')}] → importKeys [${unmatched.importKeys.join(', ')}]`,
      });
    }

    return this.repository.create({
      name: dto.name,
      exportApiId: dto.exportApiId,
      importApiId: dto.importApiId,
      fieldMapping,
      manualMappings: dto.manualMappings,
      status: 'pending',
    });
  }
}
