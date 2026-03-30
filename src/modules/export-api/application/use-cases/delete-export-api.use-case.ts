import { Injectable, NotFoundException } from '@nestjs/common';
import { ExportApiRepositoryPort } from '../../domain/ports/export-api.repository.port';

@Injectable()
export class DeleteExportApiUseCase {
  constructor(private readonly repository: ExportApiRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundException(`ExportApiConfig ${id} não encontrada`);
    await this.repository.delete(id);
  }
}
