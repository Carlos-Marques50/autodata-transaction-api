import { AuthType, RateLimit } from '../../../../shared/types/common.types';

export type ExportHttpMethod = 'GET' | 'POST';

export class ExportApiConfig {
  id: string;
  name: string;
  baseUrl: string;
  endpoint: string;
  method: ExportHttpMethod;
  authType: AuthType;
  authConfig: Record<string, string>;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  dtoSample: Record<string, unknown>;
  rateLimit?: RateLimit;
  createdAt: Date;
  updatedAt: Date;
}
