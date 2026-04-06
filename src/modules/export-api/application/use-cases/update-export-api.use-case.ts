import { Injectable, NotFoundException } from '@nestjs/common';
import { ExportApiConfig } from '../../domain/entities/export-api.entity';
import { ExportApiRepositoryPort } from '../../domain/ports/export-api.repository.port';
import { UpdateExportApiDto } from '../dtos/update-export-api.dto';

@Injectable()
export class UpdateExportApiUseCase {
  constructor(private readonly repository: ExportApiRepositoryPort) {}

  async execute(id: string, dto: UpdateExportApiDto): Promise<ExportApiConfig> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Export API with id ${id} not found`);
    }

    return this.repository.update(id, dto);
  }
}
