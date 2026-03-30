import { Injectable } from '@nestjs/common';
import { ImportApiRepositoryPort } from '../../domain/ports/import-api.repository.port';
import { CreateImportApiDto } from '../dtos/create-import-api.dto';
import { ImportApiConfig } from '../../domain/entities/import-api.entity';

@Injectable()
export class CreateImportApiUseCase {
  constructor(private readonly repository: ImportApiRepositoryPort) {}

  execute(dto: CreateImportApiDto): Promise<ImportApiConfig> {
    return this.repository.create({
      name: dto.name,
      baseUrl: dto.baseUrl,
      endpoint: dto.endpoint,
      method: dto.method,
      authType: dto.authType,
      authConfig: dto.authConfig ?? {},
      headers: dto.headers,
      dtoSample: dto.dtoSample,
    });
  }
}
