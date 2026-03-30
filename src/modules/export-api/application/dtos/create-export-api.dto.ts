import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { RateLimit } from '../../../../shared/types/common.types';

export class RateLimitDto implements RateLimit {
  @ApiProperty({ description: 'Máx. requisições por janela', example: 10 })
  @IsNumber()
  requests: number;

  @ApiProperty({ description: 'Janela de tempo em ms', example: 1000 })
  @IsNumber()
  windowMs: number;
}

export class CreateExportApiDto {
  @ApiProperty({ example: 'Legacy CRM API' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://legacy-crm.example.com' })
  @IsString()
  @IsNotEmpty()
  baseUrl: string;

  @ApiProperty({ example: '/api/v1/customers' })
  @IsString()
  @IsNotEmpty()
  endpoint: string;

  @ApiProperty({ enum: ['GET', 'POST'], default: 'GET' })
  @IsEnum(['GET', 'POST'])
  method: 'GET' | 'POST';

  @ApiProperty({ enum: ['none', 'bearer', 'apiKey', 'basic'], default: 'none' })
  @IsEnum(['none', 'bearer', 'apiKey', 'basic'])
  authType: 'none' | 'bearer' | 'apiKey' | 'basic';

  @ApiPropertyOptional({ example: { token: 'my-token' } })
  @IsOptional()
  @IsObject()
  authConfig?: Record<string, string>;

  @ApiPropertyOptional({ example: { 'X-Custom-Header': 'value' } })
  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;

  @ApiPropertyOptional({ example: { page: '1', limit: '100' } })
  @IsOptional()
  @IsObject()
  queryParams?: Record<string, string>;

  @ApiProperty({
    description:
      'Exemplo de registro retornado pela API de exportação (usado para inferir os campos)',
    example: { customer_id: 1, name: 'Carlos Martinez', email: 'carlos@example.com' },
  })
  @IsObject()
  dtoSample: Record<string, unknown>;

  @ApiPropertyOptional({ type: RateLimitDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => RateLimitDto)
  rateLimit?: RateLimitDto;
}
