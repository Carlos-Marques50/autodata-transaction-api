import { MigrationLog, LogStatus } from '../entities/migration-log.entity';

export abstract class MigrationLogRepositoryPort {
  abstract create(
    data: Omit<MigrationLog, 'id' | 'createdAt'>,
  ): Promise<MigrationLog>;
  abstract findAll(): Promise<MigrationLog[]>;
  abstract findByTransactionId(transactionId: string): Promise<MigrationLog[]>;
  abstract findFailed(): Promise<MigrationLog[]>;
  abstract updateRetry(
    id: string,
    retryCount: number,
    status: LogStatus,
    lastRetryAt: Date,
    error?: string,
  ): Promise<void>;
}
