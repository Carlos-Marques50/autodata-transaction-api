import { PartialType } from '@nestjs/swagger';
import { CreateExportApiDto } from './create-export-api.dto';

export class UpdateExportApiDto extends PartialType(CreateExportApiDto) {}
