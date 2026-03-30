import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImportApiConfigDocument = ImportApiConfigSchemaClass & Document;

@Schema({ collection: 'import_api_configs', timestamps: true })
export class ImportApiConfigSchemaClass {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) baseUrl: string;
  @Prop({ required: true }) endpoint: string;
  @Prop({ required: true, enum: ['POST', 'PUT', 'PATCH'] }) method: string;
  @Prop({ required: true, enum: ['none', 'bearer', 'apiKey', 'basic'] }) authType: string;
  @Prop({ type: Object, default: {} }) authConfig: Record<string, string>;
  @Prop({ type: Object }) headers?: Record<string, string>;
  @Prop({ type: Object, required: true }) dtoSample: object;
}

export const ImportApiConfigSchema = SchemaFactory.createForClass(ImportApiConfigSchemaClass);
