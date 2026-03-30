import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindLogsUseCase } from '../../application/use-cases/find-logs.use-case';
import { RetryFailedUseCase } from '../../application/use-cases/retry-failed.use-case';

@ApiTags('4. Migration Logs')
@Controller('migration-logs')
export class MigrationLogController {
  constructor(
    private readonly findLogsUseCase: FindLogsUseCase,
    private readonly retryFailedUseCase: RetryFailedUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os logs de migração' })
  findAll() {
    return this.findLogsUseCase.findAll();
  }

  @Get('failed')
  @ApiOperation({ summary: 'Listar registros com falha (cache para retry)' })
  findFailed() {
    return this.findLogsUseCase.findFailed();
  }

  @Get('transaction/:transactionId')
  @ApiOperation({ summary: 'Listar logs de uma transação específica' })
  findByTransaction(@Param('transactionId') transactionId: string) {
    return this.findLogsUseCase.findByTransaction(transactionId);
  }

  @Post('retry')
  @ApiOperation({ summary: 'Retentar registros com falha (processa cache local)' })
  retryFailed() {
    return this.retryFailedUseCase.execute();
  }
}
