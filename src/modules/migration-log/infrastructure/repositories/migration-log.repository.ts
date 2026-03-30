import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MigrationLogRepositoryPort } from '../../domain/ports/migration-log.repository.port';
import { MigrationLog, LogStatus } from '../../domain/entities/migration-log.entity';
import { MigrationLogDocument, MigrationLogSchemaClass } from '../schemas/migration-log.schema';

@Injectable()
export class MigrationLogRepository implements MigrationLogRepositoryPort {
  constructor(
    @InjectModel(MigrationLogSchemaClass.name)
    private readonly model: Model<MigrationLogDocument>,
  ) {}

  async create(data: Omit<MigrationLog, 'id' | 'createdAt'>): Promise<MigrationLog> {
    const doc = await this.model.create(data);
    return this.toEntity(doc);
  }

  async findAll(): Promise<MigrationLog[]> {
    const docs = await this.model.find().sort({ createdAt: -1 }).exec();
    return docs.map((d) => this.toEntity(d));
  }

  async findByTransactionId(transactionId: string): Promise<MigrationLog[]> {
    const docs = await this.model.find({ transactionId }).sort({ createdAt: -1 }).exec();
    return docs.map((d) => this.toEntity(d));
  }

  async findFailed(): Promise<MigrationLog[]> {
    const docs = await this.model
      .find({ status: { $in: ['failed', 'retrying'] } })
      .sort({ createdAt: 1 })
      .exec();
    return docs.map((d) => this.toEntity(d));
  }

  async updateRetry(
    id: string,
    retryCount: number,
    status: LogStatus,
    lastRetryAt: Date,
    error?: string,
  ): Promise<void> {
    await this.model
      .findByIdAndUpdate(id, { retryCount, status, lastRetryAt, ...(error ? { error } : {}) })
      .exec();
  }

  private toEntity(doc: MigrationLogDocument): MigrationLog {
    const obj = doc.toObject();
    return {
      id: String(doc._id),
      transactionId: obj.transactionId,
      status: obj.status,
      sourceData: obj.sourceData,
      convertedData: obj.convertedData,
      error: obj.error,
      retryCount: obj.retryCount,
      maxRetries: obj.maxRetries,
      createdAt: obj.createdAt,
      lastRetryAt: obj.lastRetryAt,
    };
  }
}
