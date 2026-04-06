import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ImportApiConfigSchemaClass,
  ImportApiConfigSchema,
} from './infrastructure/schemas/import-api.schema';
import { ImportApiRepository } from './infrastructure/repositories/import-api.repository';
import { ImportApiRepositoryPort } from './domain/ports/import-api.repository.port';
import { ImportApiController } from './infrastructure/controllers/import-api.controller';
import { CreateImportApiUseCase } from './application/use-cases/create-import-api.use-case';
import { FindAllImportApisUseCase } from './application/use-cases/find-all-import-apis.use-case';
import { FindImportApiByIdUseCase } from './application/use-cases/find-import-api-by-id.use-case';
import { UpdateImportApiUseCase } from './application/use-cases/update-import-api.use-case';
import { DeleteImportApiUseCase } from './application/use-cases/delete-import-api.use-case';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImportApiConfigSchemaClass.name, schema: ImportApiConfigSchema },
    ]),
  ],
  controllers: [ImportApiController],
  providers: [
    { provide: ImportApiRepositoryPort, useClass: ImportApiRepository },
    CreateImportApiUseCase,
    FindAllImportApisUseCase,
    FindImportApiByIdUseCase,
    UpdateImportApiUseCase,
    DeleteImportApiUseCase,
  ],
  exports: [ImportApiRepositoryPort],
})
export class ImportApiModule {}
