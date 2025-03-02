import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: { host: process.env.REDIS_HOST || 'redis', port: 6379 },
    }),
    NotificationModule,
  ],
})
export class AppModule {}