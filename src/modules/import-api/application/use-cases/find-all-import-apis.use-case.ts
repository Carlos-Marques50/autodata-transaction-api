import { Injectable } from '@nestjs/common';
import { ImportApiRepositoryPort } from '../../domain/ports/import-api.repository.port';

@Injectable()
export class FindAllImportApisUseCase {
  constructor(private readonly repository: ImportApiRepositoryPort) {}

  execute() {
    return this.repository.findAll();
  }
}
