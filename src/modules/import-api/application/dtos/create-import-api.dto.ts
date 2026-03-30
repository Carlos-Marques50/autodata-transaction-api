import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateImportApiDto {
  @ApiProperty({ example: 'New CRM API' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://new-crm.example.com' })
  @IsString()
  @IsNotEmpty()
  baseUrl: string;

  @ApiProperty({ example: '/api/v1/clients' })
  @IsString()
  @IsNotEmpty()
  endpoint: string;

  @ApiProperty({ enum: ['POST', 'PUT', 'PATCH'], default: 'POST' })
  @IsEnum(['POST', 'PUT', 'PATCH'])
  method: 'POST' | 'PUT' | 'PATCH';

  @ApiProperty({ enum: ['none', 'bearer', 'apiKey', 'basic'], default: 'none' })
  @IsEnum(['none', 'bearer', 'apiKey', 'basic'])
  authType: 'none' | 'bearer' | 'apiKey' | 'basic';

  @ApiPropertyOptional({ example: { token: 'my-token' } })
  @IsOptional()
  @IsObject()
  authConfig?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;

  @ApiProperty({
    description:
      'Exemplo de registro esperado pela API de importação (usado para inferir os campos)',
    example: { clientId: 1, fullName: 'Carlos Martinez', email: 'carlos@example.com' },
  })
  @IsObject()
  dtoSample: Record<string, unknown>;
}
