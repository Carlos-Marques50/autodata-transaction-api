import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class RateLimitDto {
  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  requests!: number;

  @ApiProperty({ example: 60000 })
  @IsNotEmpty()
  windowMs!: number;
}

export class CreateExportApiDto {
  @ApiProperty({ example: 'ERP Export API' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'https://erp.example.com' })
  @IsString()
  @IsNotEmpty()
  baseUrl!: string;

  @ApiProperty({ example: '/api/v1/customers' })
  @IsString()
  @IsNotEmpty()
  endpoint!: string;

  @ApiProperty({ enum: ['GET', 'POST'], default: 'GET' })
  @IsEnum(['GET', 'POST'])
  method!: 'GET' | 'POST';

  @ApiProperty({ enum: ['none', 'bearer', 'apiKey', 'basic'], default: 'none' })
  @IsEnum(['none', 'bearer', 'apiKey', 'basic'])
  authType!: 'none' | 'bearer' | 'apiKey' | 'basic';

  @ApiPropertyOptional({ example: { token: 'my-token' } })
  @IsOptional()
  @IsObject()
  authConfig?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  queryParams?: Record<string, string>;

  @ApiProperty({
    description:
      'Exemplo de registro retornado pela API de exportação (usado para inferir os campos)',
    example: { id: 1, name: 'Carlos', email: 'carlos@example.com' },
  })
  @IsObject()
  dtoSample!: Record<string, unknown>;

  @ApiPropertyOptional({ type: RateLimitDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => RateLimitDto)
  rateLimit?: RateLimitDto;
}
