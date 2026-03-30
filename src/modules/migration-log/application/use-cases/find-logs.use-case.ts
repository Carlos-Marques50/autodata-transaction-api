import { Injectable } from '@nestjs/common';
import { MigrationLogRepositoryPort } from '../../domain/ports/migration-log.repository.port';

@Injectable()
export class FindLogsUseCase {
  constructor(private readonly repository: MigrationLogRepositoryPort) {}

  findAll() {
    return this.repository.findAll();
  }

  findByTransaction(transactionId: string) {
    return this.repository.findByTransactionId(transactionId);
  }

  findFailed() {
    return this.repository.findFailed();
  }
}
