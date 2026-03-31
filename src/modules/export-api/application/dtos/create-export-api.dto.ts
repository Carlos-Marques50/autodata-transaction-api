import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
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

class PaginationDto {
  @ApiPropertyOptional({ example: 'page' })
  @IsOptional()
  @IsString()
  type?: 'page' | 'offset';

  @ApiPropertyOptional({ example: 'page' })
  @IsOptional()
  @IsString()
  pageParam?: string;

  @ApiPropertyOptional({ example: 'pageSize' })
  @IsOptional()
  @IsString()
  sizeParam?: string;

  @ApiPropertyOptional({ example: 'limit' })
  @IsOptional()
  @IsString()
  limitParam?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  initialPage?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limitValue?: number;

  @ApiPropertyOptional({ example: 'data' })
  @IsOptional()
  @IsString()
  dataPath?: string;
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

  @ApiPropertyOptional({ type: PaginationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination?: PaginationDto;

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
