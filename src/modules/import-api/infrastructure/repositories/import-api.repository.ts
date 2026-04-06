import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImportApiRepositoryPort } from '../../domain/ports/import-api.repository.port';
import { ImportApiConfig } from '../../domain/entities/import-api.entity';
import {
  ImportApiConfigDocument,
  ImportApiConfigSchemaClass,
} from '../schemas/import-api.schema';

@Injectable()
export class ImportApiRepository implements ImportApiRepositoryPort {
  constructor(
    @InjectModel(ImportApiConfigSchemaClass.name)
    private readonly model: Model<ImportApiConfigDocument>,
  ) {}

  async create(
    data: Omit<ImportApiConfig, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ImportApiConfig> {
    const doc = await this.model.create(data);
    return this.toEntity(doc);
  }

  async findAll(): Promise<ImportApiConfig[]> {
    const docs = await this.model.find().exec();
    return docs.map((d) => this.toEntity(d));
  }

  async findById(id: string): Promise<ImportApiConfig | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async update(
    id: string,
    data: Partial<Omit<ImportApiConfig, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ImportApiConfig> {
    const doc = await this.model
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    return this.toEntity(doc!);
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }

  private toEntity(doc: ImportApiConfigDocument): ImportApiConfig {
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
      dtoSample: obj.dtoSample,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }
}
