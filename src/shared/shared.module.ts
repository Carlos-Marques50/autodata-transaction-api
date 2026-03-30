import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpClientService } from './services/http-client.service';
import { FieldMapperService } from './services/field-mapper.service';

@Module({
  imports: [HttpModule],
  providers: [HttpClientService, FieldMapperService],
  exports: [HttpClientService, FieldMapperService],
})
export class SharedModule {}
