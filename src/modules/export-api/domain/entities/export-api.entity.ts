import { AuthType, RateLimit } from '../../../../shared/types/common.types';

export type ExportHttpMethod = 'GET' | 'POST';

export interface ExportApiPagination {
  type?: 'page' | 'offset';
  pageParam?: string;
  sizeParam?: string;
  limitParam?: string;
  initialPage?: number;
  pageSize?: number;
  limitValue?: number;
  dataPath?: string;
}

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
  pagination?: ExportApiPagination;
  dtoSample: Record<string, unknown>;
  rateLimit?: RateLimit;
  createdAt: Date;
  updatedAt: Date;
}
