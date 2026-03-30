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
import { CreateExportApiDto } from '../../application/dtos/create-export-api.dto';
import { CreateExportApiUseCase } from '../../application/use-cases/create-export-api.use-case';
import { DeleteExportApiUseCase } from '../../application/use-cases/delete-export-api.use-case';
import { FindAllExportApisUseCase } from '../../application/use-cases/find-all-export-apis.use-case';
import { FindExportApiByIdUseCase } from '../../application/use-cases/find-export-api-by-id.use-case';

@ApiTags('1. Export APIs')
@Controller('export-apis')
export class ExportApiController {
  constructor(
    private readonly createUseCase: CreateExportApiUseCase,
    private readonly findAllUseCase: FindAllExportApisUseCase,
    private readonly findByIdUseCase: FindExportApiByIdUseCase,
    private readonly deleteUseCase: DeleteExportApiUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar configuração de API de exportação + DTO schema' })
  create(@Body() dto: CreateExportApiDto) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as APIs de exportação cadastradas' })
  findAll() {
    return this.findAllUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar API de exportação por ID' })
  findById(@Param('id') id: string) {
    return this.findByIdUseCase.execute(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover API de exportação' })
  delete(@Param('id') id: string) {
    return this.deleteUseCase.execute(id);
  }
}
