export type LogStatus = 'success' | 'failed' | 'retrying';

export class MigrationLog {
  id: string;
  transactionId: string;
  status: LogStatus;
  sourceData: Record<string, unknown>;
  convertedData?: Record<string, unknown>;
  error?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  lastRetryAt?: Date;
}
