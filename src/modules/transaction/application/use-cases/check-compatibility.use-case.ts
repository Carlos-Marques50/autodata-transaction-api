import { Injectable, NotFoundException } from '@nestjs/common';
import { ExportApiRepositoryPort } from '../../../export-api/domain/ports/export-api.repository.port';
import { ImportApiRepositoryPort } from '../../../import-api/domain/ports/import-api.repository.port';
import { FieldMapperService } from '../../../../shared/services/field-mapper.service';

@Injectable()
export class CheckCompatibilityUseCase {
  constructor(
    private readonly exportApiRepo: ExportApiRepositoryPort,
    private readonly importApiRepo: ImportApiRepositoryPort,
    private readonly fieldMapper: FieldMapperService,
  ) {}

  async execute(exportApiId: string, importApiId: string) {
    const exportConfig = await this.exportApiRepo.findById(exportApiId);
    if (!exportConfig)
      throw new NotFoundException(`ExportApiConfig ${exportApiId} não encontrada`);

    const importConfig = await this.importApiRepo.findById(importApiId);
    if (!importConfig)
      throw new NotFoundException(`ImportApiConfig ${importApiId} não encontrada`);

    const { fieldMapping, unmatched } = this.fieldMapper.autoMap(
      exportConfig.dtoSample,
      importConfig.dtoSample,
    );

    const compatible =
      unmatched.exportKeys.length === 0 && unmatched.importKeys.length === 0;

    return {
      compatible,
      autoMapped: fieldMapping.map((f) => ({
        exportKey: f.exportField,
        importKey: f.importField,
      })),
      unmatched,
      ...(compatible
        ? {}
        : {
            suggestion: `Forneça manualMappings ao criar a transação para conectar os campos sem correspondência: exportKeys [${unmatched.exportKeys.join(', ')}] → importKeys [${unmatched.importKeys.join(', ')}]`,
          }),
    };
  }
}
