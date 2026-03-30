import { Injectable, NotFoundException } from '@nestjs/common';
import { ExportApiRepositoryPort } from '../../domain/ports/export-api.repository.port';

@Injectable()
export class FindExportApiByIdUseCase {
  constructor(private readonly repository: ExportApiRepositoryPort) {}

  async execute(id: string) {
    const config = await this.repository.findById(id);
    if (!config) throw new NotFoundException(`ExportApiConfig ${id} não encontrada`);
    return config;
  }
}
