import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateImportApiDto } from '../../application/dtos/create-import-api.dto';
import { CreateImportApiUseCase } from '../../application/use-cases/create-import-api.use-case';
import { DeleteImportApiUseCase } from '../../application/use-cases/delete-import-api.use-case';
import { FindAllImportApisUseCase } from '../../application/use-cases/find-all-import-apis.use-case';
import { FindImportApiByIdUseCase } from '../../application/use-cases/find-import-api-by-id.use-case';

@ApiTags('2. Import APIs')
@Controller('import-apis')
export class ImportApiController {
  constructor(
    private readonly createUseCase: CreateImportApiUseCase,
    private readonly findAllUseCase: FindAllImportApisUseCase,
    private readonly findByIdUseCase: FindImportApiByIdUseCase,
    private readonly deleteUseCase: DeleteImportApiUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar configuração de API de importação + DTO schema' })
  create(@Body() dto: CreateImportApiDto) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as APIs de importação cadastradas' })
  findAll() {
    return this.findAllUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar API de importação por ID' })
  findById(@Param('id') id: string) {
    return this.findByIdUseCase.execute(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover API de importação' })
  delete(@Param('id') id: string) {
    return this.deleteUseCase.execute(id);
  }
}
