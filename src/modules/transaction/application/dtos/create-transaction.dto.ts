import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { ManualMappingEntry } from '../../domain/entities/transaction.entity';

export class ManualMappingDto implements ManualMappingEntry {
  @ApiProperty({ example: 'nome', description: 'Chave no JSON retornado pela exportação' })
  @IsString()
  @IsNotEmpty()
  exportKey: string;

  @ApiProperty({ example: 'name', description: 'Chave no JSON esperado pela importação' })
  @IsString()
  @IsNotEmpty()
  importKey: string;

  @ApiPropertyOptional({
    enum: ['toString', 'toNumber', 'toBoolean', 'toDate', 'none'],
    default: 'none',
  })
  @IsOptional()
  transform?: ManualMappingEntry['transform'];
}

export class CreateTransactionDto {
  @ApiProperty({ example: 'Migrar Clientes Legacy → New CRM' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ID da configuração da API de exportação' })
  @IsString()
  @IsNotEmpty()
  exportApiId: string;

  @ApiProperty({ description: 'ID da configuração da API de importação' })
  @IsString()
  @IsNotEmpty()
  importApiId: string;

  @ApiPropertyOptional({
    type: [ManualMappingDto],
    description:
      'Mapeamentos manuais para campos sem correspondência automática (obrigatório quando os nomes diferem)',
    example: [{ exportKey: 'nome', importKey: 'name' }],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ManualMappingDto)
  manualMappings?: ManualMappingDto[];
}
