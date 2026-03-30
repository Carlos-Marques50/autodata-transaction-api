import { AuthType } from '../../../../shared/types/common.types';

export type ImportHttpMethod = 'POST' | 'PUT' | 'PATCH';

export class ImportApiConfig {
  id: string;
  name: string;
  baseUrl: string;
  endpoint: string;
  method: ImportHttpMethod;
  authType: AuthType;
  authConfig: Record<string, string>;
  headers?: Record<string, string>;
  dtoSample: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
