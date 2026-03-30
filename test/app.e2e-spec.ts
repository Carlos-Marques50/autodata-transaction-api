import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ExportApiController } from '../src/modules/export-api/infrastructure/controllers/export-api.controller';
import { ImportApiController } from '../src/modules/import-api/infrastructure/controllers/import-api.controller';
import { TransactionController } from '../src/modules/transaction/infrastructure/controllers/transaction.controller';
import { MigrationLogController } from '../src/modules/migration-log/infrastructure/controllers/migration-log.controller';
import { CreateExportApiUseCase } from '../src/modules/export-api/application/use-cases/create-export-api.use-case';
import { FindAllExportApisUseCase } from '../src/modules/export-api/application/use-cases/find-all-export-apis.use-case';
import { FindExportApiByIdUseCase } from '../src/modules/export-api/application/use-cases/find-export-api-by-id.use-case';
import { DeleteExportApiUseCase } from '../src/modules/export-api/application/use-cases/delete-export-api.use-case';
import { CreateImportApiUseCase } from '../src/modules/import-api/application/use-cases/create-import-api.use-case';
import { FindAllImportApisUseCase } from '../src/modules/import-api/application/use-cases/find-all-import-apis.use-case';
import { FindImportApiByIdUseCase } from '../src/modules/import-api/application/use-cases/find-import-api-by-id.use-case';
import { DeleteImportApiUseCase } from '../src/modules/import-api/application/use-cases/delete-import-api.use-case';
import { CreateTransactionUseCase } from '../src/modules/transaction/application/use-cases/create-transaction.use-case';
import { FindAllTransactionsUseCase } from '../src/modules/transaction/application/use-cases/find-all-transactions.use-case';
import { ExecuteTransactionUseCase } from '../src/modules/transaction/application/use-cases/execute-transaction.use-case';
import { CheckCompatibilityUseCase } from '../src/modules/transaction/application/use-cases/check-compatibility.use-case';
import { FindLogsUseCase } from '../src/modules/migration-log/application/use-cases/find-logs.use-case';
import { RetryFailedUseCase } from '../src/modules/migration-log/application/use-cases/retry-failed.use-case';
import { ExportApiRepositoryPort } from '../src/modules/export-api/domain/ports/export-api.repository.port';
import { ImportApiRepositoryPort } from '../src/modules/import-api/domain/ports/import-api.repository.port';
import { TransactionRepositoryPort } from '../src/modules/transaction/domain/ports/transaction.repository.port';
import { MigrationLogRepositoryPort } from '../src/modules/migration-log/domain/ports/migration-log.repository.port';
import { FieldMapperService } from '../src/shared/services/field-mapper.service';
import { HttpClientService } from '../src/shared/services/http-client.service';
import type { ExportApiConfig } from '../src/modules/export-api/domain/entities/export-api.entity';
import type { ImportApiConfig } from '../src/modules/import-api/domain/entities/import-api.entity';
import type {
  Transaction,
  TransactionStatus,
} from '../src/modules/transaction/domain/entities/transaction.entity';
import type {
  LogStatus,
  MigrationLog,
} from '../src/modules/migration-log/domain/entities/migration-log.entity';

class InMemoryExportApiRepository implements ExportApiRepositoryPort {
  private readonly items: ExportApiConfig[] = [];
  private seq = 1;

  async create(data: Omit<ExportApiConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExportApiConfig> {
    const item: ExportApiConfig = {
      id: String(this.seq++),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.push(item);
    return item;
  }

  async findAll(): Promise<ExportApiConfig[]> {
    return [...this.items];
  }

  async findById(id: string): Promise<ExportApiConfig | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async delete(id: string): Promise<void> {
    const idx = this.items.findIndex((item) => item.id === id);
    if (idx >= 0) this.items.splice(idx, 1);
  }
}

class InMemoryImportApiRepository implements ImportApiRepositoryPort {
  private readonly items: ImportApiConfig[] = [];
  private seq = 1;

  async create(data: Omit<ImportApiConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<ImportApiConfig> {
    const item: ImportApiConfig = {
      id: String(this.seq++),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.push(item);
    return item;
  }

  async findAll(): Promise<ImportApiConfig[]> {
    return [...this.items];
  }

  async findById(id: string): Promise<ImportApiConfig | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async delete(id: string): Promise<void> {
    const idx = this.items.findIndex((item) => item.id === id);
    if (idx >= 0) this.items.splice(idx, 1);
  }
}

class InMemoryTransactionRepository implements TransactionRepositoryPort {
  private readonly items: Transaction[] = [];
  private seq = 1;

  async create(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const item: Transaction = {
      id: String(this.seq++),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.push(item);
    return item;
  }

  async findAll(): Promise<Transaction[]> {
    return [...this.items];
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async updateStatus(id: string, status: TransactionStatus, lastRunAt?: Date): Promise<void> {
    const item = this.items.find((tx) => tx.id === id);
    if (!item) return;
    item.status = status;
    item.lastRunAt = lastRunAt;
    item.updatedAt = new Date();
  }

  async delete(id: string): Promise<void> {
    const idx = this.items.findIndex((item) => item.id === id);
    if (idx >= 0) this.items.splice(idx, 1);
  }
}

class InMemoryMigrationLogRepository implements MigrationLogRepositoryPort {
  private readonly items: MigrationLog[] = [];
  private seq = 1;

  async create(data: Omit<MigrationLog, 'id' | 'createdAt'>): Promise<MigrationLog> {
    const item: MigrationLog = {
      id: String(this.seq++),
      ...data,
      createdAt: new Date(),
    };
    this.items.push(item);
    return item;
  }

  async findAll(): Promise<MigrationLog[]> {
    return [...this.items].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async findByTransactionId(transactionId: string): Promise<MigrationLog[]> {
    return this.items
      .filter((log) => log.transactionId === transactionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findFailed(): Promise<MigrationLog[]> {
    return this.items
      .filter((log) => log.status === 'failed' || log.status === 'retrying')
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async updateRetry(
    id: string,
    retryCount: number,
    status: LogStatus,
    lastRetryAt: Date,
    error?: string,
  ): Promise<void> {
    const item = this.items.find((log) => log.id === id);
    if (!item) return;
    item.retryCount = retryCount;
    item.status = status;
    item.lastRetryAt = lastRetryAt;
    if (error) item.error = error;
  }
}

describe('Migration Flow (e2e)', () => {
  let app: INestApplication;

  const fetchMock = jest.fn();
  const sendMock = jest.fn();

  beforeEach(async () => {
    fetchMock.mockReset();
    sendMock.mockReset();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [
        ExportApiController,
        ImportApiController,
        TransactionController,
        MigrationLogController,
      ],
      providers: [
        CreateExportApiUseCase,
        FindAllExportApisUseCase,
        FindExportApiByIdUseCase,
        DeleteExportApiUseCase,
        CreateImportApiUseCase,
        FindAllImportApisUseCase,
        FindImportApiByIdUseCase,
        DeleteImportApiUseCase,
        CreateTransactionUseCase,
        FindAllTransactionsUseCase,
        ExecuteTransactionUseCase,
        CheckCompatibilityUseCase,
        FindLogsUseCase,
        RetryFailedUseCase,
        FieldMapperService,
        { provide: ExportApiRepositoryPort, useClass: InMemoryExportApiRepository },
        { provide: ImportApiRepositoryPort, useClass: InMemoryImportApiRepository },
        { provide: TransactionRepositoryPort, useClass: InMemoryTransactionRepository },
        { provide: MigrationLogRepositoryPort, useClass: InMemoryMigrationLogRepository },
        {
          provide: HttpClientService,
          useValue: {
            fetch: fetchMock,
            send: sendMock,
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('deve executar migracao com falha parcial e recuperar no retry', async () => {
    fetchMock.mockResolvedValue([
      { customer_id: 1, name: 'Ana' },
      { customer_id: 2, name: 'Bruno' },
    ]);
    sendMock
      .mockResolvedValueOnce({ ok: true })
      .mockRejectedValueOnce(new Error('Falha na API de importacao'))
      .mockResolvedValueOnce({ ok: true });

    const exportRes = await request(app.getHttpServer()).post('/export-apis').send({
      name: 'Legacy API',
      baseUrl: 'https://legacy.example.com',
      endpoint: '/customers',
      method: 'GET',
      authType: 'none',
      dtoSample: { customer_id: 1, name: 'Ana' },
      rateLimit: { requests: 10, windowMs: 1000 },
    });
    expect(exportRes.status).toBe(201);

    const importRes = await request(app.getHttpServer()).post('/import-apis').send({
      name: 'Target API',
      baseUrl: 'https://target.example.com',
      endpoint: '/clients',
      method: 'POST',
      authType: 'none',
      dtoSample: { clientId: 0, fullName: '' },
    });
    expect(importRes.status).toBe(201);

    const transactionRes = await request(app.getHttpServer()).post('/transactions').send({
      name: 'Migrar clientes',
      exportApiId: exportRes.body.id,
      importApiId: importRes.body.id,
      manualMappings: [
        { exportKey: 'customer_id', importKey: 'clientId', transform: 'toNumber' },
        { exportKey: 'name', importKey: 'fullName', transform: 'toString' },
      ],
    });
    expect(transactionRes.status).toBe(201);

    const executeRes = await request(app.getHttpServer())
      .post(`/transactions/${transactionRes.body.id}/execute`)
      .send();

    expect(executeRes.status).toBe(201);
    expect(executeRes.body).toEqual({ success: 1, failed: 1 });

    const failedLogsBeforeRetry = await request(app.getHttpServer())
      .get('/migration-logs/failed')
      .send();
    expect(failedLogsBeforeRetry.status).toBe(200);
    expect(failedLogsBeforeRetry.body).toHaveLength(1);

    const retryRes = await request(app.getHttpServer()).post('/migration-logs/retry').send();
    expect(retryRes.status).toBe(201);
    expect(retryRes.body).toEqual({ retried: 1, recovered: 1, stillFailed: 0 });

    const failedLogsAfterRetry = await request(app.getHttpServer())
      .get('/migration-logs/failed')
      .send();
    expect(failedLogsAfterRetry.status).toBe(200);
    expect(failedLogsAfterRetry.body).toHaveLength(0);

    const allLogs = await request(app.getHttpServer()).get('/migration-logs').send();
    expect(allLogs.status).toBe(200);
    expect(allLogs.body).toHaveLength(2);
    expect(sendMock).toHaveBeenCalledTimes(3);
  });

  it('deve detectar incompatibilidade de chaves e retornar sugestao de mapeamento', async () => {
    const exportRes = await request(app.getHttpServer()).post('/export-apis').send({
      name: 'Legacy API Incompat',
      baseUrl: 'https://legacy.example.com',
      endpoint: '/users',
      method: 'GET',
      authType: 'none',
      dtoSample: { nome: 'Carlos Martinez', email: 'carlos@example.com' },
    });
    expect(exportRes.status).toBe(201);

    const importRes = await request(app.getHttpServer()).post('/import-apis').send({
      name: 'Target API Incompat',
      baseUrl: 'https://target.example.com',
      endpoint: '/users',
      method: 'POST',
      authType: 'none',
      dtoSample: { name: '', field: '' },
    });
    expect(importRes.status).toBe(201);

    const compatibilityRes = await request(app.getHttpServer())
      .post('/transactions/check-compatibility')
      .send({
        exportApiId: exportRes.body.id,
        importApiId: importRes.body.id,
      });

    expect(compatibilityRes.status).toBe(201);
    expect(compatibilityRes.body.compatible).toBe(false);
    expect(compatibilityRes.body.autoMapped).toEqual([]);
    expect(compatibilityRes.body.unmatched).toEqual({
      exportKeys: ['nome', 'email'],
      importKeys: ['name', 'field'],
    });
    expect(compatibilityRes.body.suggestion).toContain('Forneça manualMappings');
  });
});
