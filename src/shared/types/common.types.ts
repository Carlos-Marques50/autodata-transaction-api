export type AuthType = 'none' | 'bearer' | 'apiKey' | 'basic';

export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';

export interface DtoField {
  name: string;
  type: FieldType;
  required: boolean;
  /** Notação dot para campos aninhados. Ex: "address.city" */
  path?: string;
}

export interface RateLimit {
  /** Máx. requisições por janela */
  requests: number;
  /** Janela de tempo em milissegundos */
  windowMs: number;
}

export interface ManualMapping {
  /** Chave no JSON retornado pela API de exportação */
  exportKey: string;
  /** Chave no JSON esperado pela API de importação */
  importKey: string;
  /** Conversão de tipo opcional (padrão: 'none') */
  transform?: 'toString' | 'toNumber' | 'toBoolean' | 'toDate' | 'none';
}
