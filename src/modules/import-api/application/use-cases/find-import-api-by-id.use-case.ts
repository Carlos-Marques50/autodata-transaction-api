import { Injectable, NotFoundException } from '@nestjs/common';
import { ImportApiRepositoryPort } from '../../domain/ports/import-api.repository.port';

@Injectable()
export class FindImportApiByIdUseCase {
  constructor(private readonly repository: ImportApiRepositoryPort) {}

  async execute(id: string) {
    const config = await this.repository.findById(id);
    if (!config) throw new NotFoundException(`ImportApiConfig ${id} não encontrada`);
    return config;
  }
}
