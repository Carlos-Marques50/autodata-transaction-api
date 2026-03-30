import { Injectable } from '@nestjs/common';
import { ExportApiRepositoryPort } from '../../domain/ports/export-api.repository.port';

@Injectable()
export class FindAllExportApisUseCase {
  constructor(private readonly repository: ExportApiRepositoryPort) {}

  execute() {
    return this.repository.findAll();
  }
}
