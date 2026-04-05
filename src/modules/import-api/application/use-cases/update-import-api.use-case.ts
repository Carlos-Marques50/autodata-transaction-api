import { Injectable, NotFoundException } from '@nestjs/common';
import { ImportApiConfig } from '../../domain/entities/import-api.entity';
import { ImportApiRepositoryPort } from '../../domain/ports/import-api.repository.port';
import { UpdateImportApiDto } from '../dtos/update-import-api.dto';

@Injectable()
export class UpdateImportApiUseCase {
  constructor(private readonly repository: ImportApiRepositoryPort) {}

  async execute(id: string, dto: UpdateImportApiDto): Promise<ImportApiConfig> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Import API with id ${id} not found`);
    }

    return this.repository.update(id, dto);
  }
}
