import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckCompatibilityDto {
  @ApiProperty({ description: 'ID da configuração da API de exportação' })
  @IsString()
  @IsNotEmpty()
  exportApiId: string;

  @ApiProperty({ description: 'ID da configuração da API de importação' })
  @IsString()
  @IsNotEmpty()
  importApiId: string;
}
