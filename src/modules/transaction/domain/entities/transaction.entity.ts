export type TransformType = 'toString' | 'toNumber' | 'toBoolean' | 'toDate' | 'none';

export interface FieldMapping {
  exportField: string;
  importField: string;
  transform?: TransformType;
}

export interface ManualMappingEntry {
  exportKey: string;
  importKey: string;
  transform?: TransformType;
}

export type TransactionStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'partial';

export class Transaction {
  id: string;
  name: string;
  exportApiId: string;
  importApiId: string;
  fieldMapping: FieldMapping[];
  manualMappings?: ManualMappingEntry[];
  status: TransactionStatus;
  lastRunAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
