import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ExportApiConfig } from '../../modules/export-api/domain/entities/export-api.entity';
import { ImportApiConfig } from '../../modules/import-api/domain/entities/import-api.entity';
import { RateLimit } from '../types/common.types';

interface RateLimitState {
  windowStart: number;
  callCount: number;
}

@Injectable()
export class HttpClientService {
  /** Controle de rate limit por apiId */
  private readonly rateLimitMap = new Map<string, RateLimitState>();

  constructor(private readonly httpService: HttpService) {}

  async fetch(config: ExportApiConfig): Promise<unknown> {
    await this.applyRateLimit(config.id, config.rateLimit);

    const headers = this.buildHeaders(config.authType, config.authConfig, config.headers);
    const response = await firstValueFrom(
      this.httpService.request({
        method: config.method,
        url: `${config.baseUrl}${config.endpoint}`,
        headers,
        params: config.queryParams,
      }),
    );
    return response.data;
  }

  async send(
    config: ImportApiConfig,
    data: Record<string, unknown>,
  ): Promise<unknown> {
    const headers = this.buildHeaders(config.authType, config.authConfig, config.headers);
    const response = await firstValueFrom(
      this.httpService.request({
        method: config.method,
        url: `${config.baseUrl}${config.endpoint}`,
        headers,
        data,
      }),
    );
    return response.data;
  }

  private buildHeaders(
    authType: string,
    authConfig: Record<string, string>,
    extraHeaders?: Record<string, string>,
  ): Record<string, string> {
    const headers: Record<string, string> = { ...extraHeaders };

    switch (authType) {
      case 'bearer':
        headers['Authorization'] = `Bearer ${authConfig['token'] ?? ''}`;
        break;
      case 'apiKey': {
        const headerName = authConfig['headerName'] ?? 'X-Api-Key';
        headers[headerName] = authConfig['key'] ?? '';
        break;
      }
      case 'basic': {
        const encoded = Buffer.from(
          `${authConfig['username'] ?? ''}:${authConfig['password'] ?? ''}`,
        ).toString('base64');
        headers['Authorization'] = `Basic ${encoded}`;
        break;
      }
    }

    return headers;
  }

  /** Rate limiting: garante máx. N req por janela. Protege APIs com restrição de DDoS. */
  private async applyRateLimit(apiId: string, rateLimit?: RateLimit): Promise<void> {
    if (!rateLimit) return;

    const now = Date.now();
    const state: RateLimitState = this.rateLimitMap.get(apiId) ?? {
      windowStart: now,
      callCount: 0,
    };

    // Resetar janela se expirada
    if (now - state.windowStart >= rateLimit.windowMs) {
      state.windowStart = now;
      state.callCount = 0;
    }

    // Aguardar se limite atingido
    if (state.callCount >= rateLimit.requests) {
      const wait = rateLimit.windowMs - (now - state.windowStart);
      await new Promise<void>((resolve) => setTimeout(resolve, wait));
      state.windowStart = Date.now();
      state.callCount = 0;
    }

    state.callCount++;
    this.rateLimitMap.set(apiId, state);
  }
}
