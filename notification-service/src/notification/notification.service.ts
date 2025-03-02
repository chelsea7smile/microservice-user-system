import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Processor('notifications')
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(@InjectQueue('notifications') private readonly notificationQueue: Queue) {}

  @Process('sendPush')
async handleSendPush(job: Job<{ userId: number; username?: string }>) {
  const { userId, username } = job.data;
  const displayName = username || `user ${userId}`;
  this.logger.log(`Processing job: sendPush for ${displayName}`);
  try {
    await axios.post('https://webhook.site/954cee53-5ac0-4a77-96fd-420bb60700e9', {
      message: `Hello, ${displayName}!`
    });
    this.logger.log(`Notification sent for ${displayName}`);
  } catch (error: unknown) {
    this.logger.error(`Failed to send notification for ${displayName}`, error as Error);
  }
}

  async scheduleNotification(userId: number, username: string, delayMs: number) {
    this.logger.log(`Scheduling notification for ${username} in ${delayMs}ms`);
    await this.notificationQueue.add('sendPush', { userId, username }, { delay: delayMs });
  }
}