import { Injectable } from '@nestjs/common';
import { ExportApiConfig } from '../../domain/entities/export-api.entity';
import { ExportApiRepositoryPort } from '../../domain/ports/export-api.repository.port';
import { CreateExportApiDto } from '../dtos/create-export-api.dto';

@Injectable()
export class CreateExportApiUseCase {
  constructor(private readonly repository: ExportApiRepositoryPort) {}

  execute(dto: CreateExportApiDto): Promise<ExportApiConfig> {
    return this.repository.create({
      name: dto.name,
      baseUrl: dto.baseUrl,
      endpoint: dto.endpoint,
      method: dto.method,
      authType: dto.authType,
      authConfig: dto.authConfig ?? {},
      headers: dto.headers,
      queryParams: dto.queryParams,
      dtoSample: dto.dtoSample,
      rateLimit: dto.rateLimit,
    });
  }
}
