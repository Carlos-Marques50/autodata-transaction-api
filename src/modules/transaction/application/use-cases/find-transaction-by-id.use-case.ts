import { Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';

@Injectable()
export class FindTransactionByIdUseCase {
  constructor(private readonly repository: TransactionRepositoryPort) {}

  async execute(id: string): Promise<Transaction> {
    const transaction = await this.repository.findById(id);

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    return transaction;
  }
}
