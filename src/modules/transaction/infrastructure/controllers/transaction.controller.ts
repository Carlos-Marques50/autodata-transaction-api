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
import { CreateTransactionDto } from '../../application/dtos/create-transaction.dto';
import { CheckCompatibilityDto } from '../../application/dtos/check-compatibility.dto';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { CheckCompatibilityUseCase } from '../../application/use-cases/check-compatibility.use-case';
import { ExecuteTransactionUseCase } from '../../application/use-cases/execute-transaction.use-case';
import { FindAllTransactionsUseCase } from '../../application/use-cases/find-all-transactions.use-case';
import { FindTransactionByIdUseCase } from '../../application/use-cases/find-transaction-by-id.use-case';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';

@ApiTags('3. Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createUseCase: CreateTransactionUseCase,
    private readonly findAllUseCase: FindAllTransactionsUseCase,
    private readonly findByIdUseCase: FindTransactionByIdUseCase,
    private readonly executeUseCase: ExecuteTransactionUseCase,
    private readonly checkCompatibilityUseCase: CheckCompatibilityUseCase,
    private readonly transactionRepo: TransactionRepositoryPort,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar transação (define quem exporta e quem importa)' })
  create(@Body() dto: CreateTransactionDto) {
    return this.createUseCase.execute(dto);
  }

  @Post('check-compatibility')
  @ApiOperation({
    summary:
      'Verifica compatibilidade de campos entre export e import. Retorna mapeamento automático e campos sem correspondência.',
  })
  checkCompatibility(@Body() dto: CheckCompatibilityDto) {
    return this.checkCompatibilityUseCase.execute(dto.exportApiId, dto.importApiId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as transações' })
  findAll() {
    return this.findAllUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar transação por ID' })
  findById(@Param('id') id: string) {
    return this.findByIdUseCase.execute(id);
  }

  @Post(':id/execute')
  @ApiOperation({
    summary: 'Executar transação: extrai → verifica → converte → importa → loga',
  })
  execute(@Param('id') id: string) {
    return this.executeUseCase.execute(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover transação' })
  async delete(@Param('id') id: string) {
    await this.transactionRepo.delete(id);
  }
}
