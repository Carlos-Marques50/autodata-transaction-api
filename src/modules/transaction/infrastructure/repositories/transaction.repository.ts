import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';
import { Transaction, TransactionStatus } from '../../domain/entities/transaction.entity';
import { TransactionDocument, TransactionSchemaClass } from '../schemas/transaction.schema';

@Injectable()
export class TransactionRepository implements TransactionRepositoryPort {
  constructor(
    @InjectModel(TransactionSchemaClass.name)
    private readonly model: Model<TransactionDocument>,
  ) {}

  async create(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const doc = await this.model.create(data);
    return this.toEntity(doc);
  }

  async findAll(): Promise<Transaction[]> {
    const docs = await this.model.find().exec();
    return docs.map((d) => this.toEntity(d));
  }

  async findById(id: string): Promise<Transaction | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async updateStatus(id: string, status: TransactionStatus, lastRunAt?: Date): Promise<void> {
    await this.model
      .findByIdAndUpdate(id, { status, ...(lastRunAt ? { lastRunAt } : {}) })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }

  private toEntity(doc: TransactionDocument): Transaction {
    const obj = doc.toObject();
    return {
      id: String(doc._id),
      name: obj.name,
      exportApiId: obj.exportApiId,
      importApiId: obj.importApiId,
      fieldMapping: obj.fieldMapping,
      manualMappings: obj.manualMappings,
      status: obj.status,
      lastRunAt: obj.lastRunAt,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }
}
