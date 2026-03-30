import { ExportApiConfig } from '../entities/export-api.entity';

export abstract class ExportApiRepositoryPort {
  abstract create(
    data: Omit<ExportApiConfig, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ExportApiConfig>;
  abstract findAll(): Promise<ExportApiConfig[]>;
  abstract findById(id: string): Promise<ExportApiConfig | null>;
  abstract delete(id: string): Promise<void>;
}
