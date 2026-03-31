import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExportApiRepositoryPort } from '../../domain/ports/export-api.repository.port';
import { ExportApiConfig } from '../../domain/entities/export-api.entity';
import {
  ExportApiConfigDocument,
  ExportApiConfigSchemaClass,
} from '../schemas/export-api.schema';

@Injectable()
export class ExportApiRepository implements ExportApiRepositoryPort {
  constructor(
    @InjectModel(ExportApiConfigSchemaClass.name)
    private readonly model: Model<ExportApiConfigDocument>,
  ) {}

  async create(
    data: Omit<ExportApiConfig, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ExportApiConfig> {
    const doc = await this.model.create(data);
    return this.toEntity(doc);
  }

  async findAll(): Promise<ExportApiConfig[]> {
    const docs = await this.model.find().exec();
    return docs.map((d) => this.toEntity(d));
  }

  async findById(id: string): Promise<ExportApiConfig | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }

  private toEntity(doc: ExportApiConfigDocument): ExportApiConfig {
    const obj = doc.toObject();
    return {
      id: String(doc._id),
      name: obj.name,
      baseUrl: obj.baseUrl,
      endpoint: obj.endpoint,
      method: obj.method,
      authType: obj.authType,
      authConfig: obj.authConfig,
      headers: obj.headers,
      queryParams: obj.queryParams,
      pagination: obj.pagination,
      dtoSample: obj.dtoSample,
      rateLimit: obj.rateLimit,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }
}
