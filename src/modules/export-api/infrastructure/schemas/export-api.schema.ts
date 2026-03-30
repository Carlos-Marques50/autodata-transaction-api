import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExportApiConfigDocument = ExportApiConfigSchemaClass & Document;

@Schema({ collection: 'export_api_configs', timestamps: true })
export class ExportApiConfigSchemaClass {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) baseUrl: string;
  @Prop({ required: true }) endpoint: string;
  @Prop({ required: true, enum: ['GET', 'POST'] }) method: string;
  @Prop({ required: true, enum: ['none', 'bearer', 'apiKey', 'basic'] }) authType: string;
  @Prop({ type: Object, default: {} }) authConfig: Record<string, string>;
  @Prop({ type: Object }) headers?: Record<string, string>;
  @Prop({ type: Object }) queryParams?: Record<string, string>;
  @Prop({ type: Object, required: true }) dtoSample: object;
  @Prop({ type: Object }) rateLimit?: { requests: number; windowMs: number };
}

export const ExportApiConfigSchema = SchemaFactory.createForClass(ExportApiConfigSchemaClass);
