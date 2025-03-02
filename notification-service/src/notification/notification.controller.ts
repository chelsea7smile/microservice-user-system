import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('user.created')
async handleUserCreated(@Payload() data: { userId: number; username: string }) {
  const delayMs = 86400000; // or 1 sec for testing
  await this.notificationService.scheduleNotification(data.userId, data.username, delayMs);
  return { status: 'scheduled' };
}
}