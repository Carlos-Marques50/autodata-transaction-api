import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = TransactionSchemaClass & Document;

@Schema({ collection: 'transactions', timestamps: true })
export class TransactionSchemaClass {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) exportApiId: string;
  @Prop({ required: true }) importApiId: string;
  @Prop({ type: [Object], required: true }) fieldMapping: object[];
  @Prop({ type: [Object], default: [] }) manualMappings?: object[];
  @Prop({
    required: true,
    enum: ['pending', 'running', 'completed', 'failed', 'partial'],
    default: 'pending',
  })
  status: string;
  @Prop() lastRunAt?: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionSchemaClass);
