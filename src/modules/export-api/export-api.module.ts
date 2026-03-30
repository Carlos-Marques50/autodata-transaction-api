import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExportApiConfigSchemaClass, ExportApiConfigSchema } from './infrastructure/schemas/export-api.schema';
import { ExportApiRepository } from './infrastructure/repositories/export-api.repository';
import { ExportApiRepositoryPort } from './domain/ports/export-api.repository.port';
import { ExportApiController } from './infrastructure/controllers/export-api.controller';
import { CreateExportApiUseCase } from './application/use-cases/create-export-api.use-case';
import { FindAllExportApisUseCase } from './application/use-cases/find-all-export-apis.use-case';
import { FindExportApiByIdUseCase } from './application/use-cases/find-export-api-by-id.use-case';
import { DeleteExportApiUseCase } from './application/use-cases/delete-export-api.use-case';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExportApiConfigSchemaClass.name, schema: ExportApiConfigSchema },
    ]),
  ],
  controllers: [ExportApiController],
  providers: [
    { provide: ExportApiRepositoryPort, useClass: ExportApiRepository },
    CreateExportApiUseCase,
    FindAllExportApisUseCase,
    FindExportApiByIdUseCase,
    DeleteExportApiUseCase,
  ],
  exports: [ExportApiRepositoryPort],
})
export class ExportApiModule {}
