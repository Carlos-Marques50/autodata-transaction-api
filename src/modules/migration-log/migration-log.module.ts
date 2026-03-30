import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MigrationLogSchemaClass, MigrationLogSchema } from './infrastructure/schemas/migration-log.schema';
import { MigrationLogRepository } from './infrastructure/repositories/migration-log.repository';
import { MigrationLogRepositoryPort } from './domain/ports/migration-log.repository.port';
import { MigrationLogController } from './infrastructure/controllers/migration-log.controller';
import { FindLogsUseCase } from './application/use-cases/find-logs.use-case';
import { RetryFailedUseCase } from './application/use-cases/retry-failed.use-case';
import { ExportApiModule } from '../export-api/export-api.module';
import { ImportApiModule } from '../import-api/import-api.module';
import { TransactionModule } from '../transaction/transaction.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MigrationLogSchemaClass.name, schema: MigrationLogSchema },
    ]),
    forwardRef(() => TransactionModule),
    ExportApiModule,
    ImportApiModule,
    SharedModule,
  ],
  controllers: [MigrationLogController],
  providers: [
    { provide: MigrationLogRepositoryPort, useClass: MigrationLogRepository },
    FindLogsUseCase,
    RetryFailedUseCase,
  ],
  exports: [MigrationLogRepositoryPort],
})
export class MigrationLogModule {}
