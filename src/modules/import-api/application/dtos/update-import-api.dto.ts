import { PartialType } from '@nestjs/swagger';
import { CreateImportApiDto } from './create-import-api.dto';

export class UpdateImportApiDto extends PartialType(CreateImportApiDto) {}
