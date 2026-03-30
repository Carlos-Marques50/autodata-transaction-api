import { Transaction, TransactionStatus } from '../entities/transaction.entity';

export abstract class TransactionRepositoryPort {
  abstract create(
    data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Transaction>;
  abstract findAll(): Promise<Transaction[]>;
  abstract findById(id: string): Promise<Transaction | null>;
  abstract updateStatus(
    id: string,
    status: TransactionStatus,
    lastRunAt?: Date,
  ): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
