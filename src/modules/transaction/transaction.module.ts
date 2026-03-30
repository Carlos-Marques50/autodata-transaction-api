import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchemaClass, TransactionSchema } from './infrastructure/schemas/transaction.schema';
import { TransactionRepository } from './infrastructure/repositories/transaction.repository';
import { TransactionRepositoryPort } from './domain/ports/transaction.repository.port';
import { TransactionController } from './infrastructure/controllers/transaction.controller';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { FindAllTransactionsUseCase } from './application/use-cases/find-all-transactions.use-case';
import { ExecuteTransactionUseCase } from './application/use-cases/execute-transaction.use-case';
import { CheckCompatibilityUseCase } from './application/use-cases/check-compatibility.use-case';
import { ExportApiModule } from '../export-api/export-api.module';
import { ImportApiModule } from '../import-api/import-api.module';
import { MigrationLogModule } from '../migration-log/migration-log.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TransactionSchemaClass.name, schema: TransactionSchema }]),
    ExportApiModule,
    ImportApiModule,
    forwardRef(() => MigrationLogModule),
    SharedModule,
  ],
  controllers: [TransactionController],
  providers: [
    { provide: TransactionRepositoryPort, useClass: TransactionRepository },
    CreateTransactionUseCase,
    FindAllTransactionsUseCase,
    ExecuteTransactionUseCase,
    CheckCompatibilityUseCase,
  ],
  exports: [TransactionRepositoryPort],
})
export class TransactionModule {}
