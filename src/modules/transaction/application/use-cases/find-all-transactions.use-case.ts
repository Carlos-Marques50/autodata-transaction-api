import { Injectable } from '@nestjs/common';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';

@Injectable()
export class FindAllTransactionsUseCase {
  constructor(private readonly repository: TransactionRepositoryPort) {}

  execute() {
    return this.repository.findAll();
  }
}
