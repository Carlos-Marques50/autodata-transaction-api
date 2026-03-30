import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MigrationLogDocument = MigrationLogSchemaClass & Document;

@Schema({ collection: 'migration_logs', timestamps: true })
export class MigrationLogSchemaClass {
  @Prop({ required: true }) transactionId: string;
  @Prop({ required: true, enum: ['success', 'failed', 'retrying'] }) status: string;
  @Prop({ type: Object, required: true }) sourceData: Record<string, unknown>;
  @Prop({ type: Object }) convertedData?: Record<string, unknown>;
  @Prop() error?: string;
  @Prop({ default: 0 }) retryCount: number;
  @Prop({ default: 3 }) maxRetries: number;
  @Prop() lastRetryAt?: Date;
}

export const MigrationLogSchema = SchemaFactory.createForClass(MigrationLogSchemaClass);
MigrationLogSchema.index({ transactionId: 1 });
MigrationLogSchema.index({ status: 1 });
