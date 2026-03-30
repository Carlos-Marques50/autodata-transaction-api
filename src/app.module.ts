import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ExportApiModule } from './modules/export-api/export-api.module';
import { ImportApiModule } from './modules/import-api/import-api.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { MigrationLogModule } from './modules/migration-log/migration-log.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/autodata'),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    SharedModule,
    ExportApiModule,
    ImportApiModule,
    TransactionModule,
    MigrationLogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
