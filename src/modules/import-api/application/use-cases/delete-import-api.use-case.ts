import { Injectable, NotFoundException } from '@nestjs/common';
import { ImportApiRepositoryPort } from '../../domain/ports/import-api.repository.port';

@Injectable()
export class DeleteImportApiUseCase {
  constructor(private readonly repository: ImportApiRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundException(`ImportApiConfig ${id} não encontrada`);
    await this.repository.delete(id);
  }
}
