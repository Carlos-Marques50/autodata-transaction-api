import { ImportApiConfig } from '../entities/import-api.entity';

export abstract class ImportApiRepositoryPort {
  abstract create(
    data: Omit<ImportApiConfig, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ImportApiConfig>;
  abstract findAll(): Promise<ImportApiConfig[]>;
  abstract findById(id: string): Promise<ImportApiConfig | null>;
  abstract delete(id: string): Promise<void>;
}
