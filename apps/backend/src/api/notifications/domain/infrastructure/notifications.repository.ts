import { Injectable } from '@nestjs/common';
import { INotificationsRepository } from '../entities/notifications.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { INotificationTokenResponse } from '@ecommerce/shared';
import { SaveTokenDto } from '../../dto/save-token.dto';

@Injectable()
export class NotificationsRepository implements INotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveToken(userId: string, data: SaveTokenDto): Promise<INotificationTokenResponse> {
    return this.prisma.notificationToken.upsert({
      where: { token: data.token },
      update: { user_id: userId, device_type: data.deviceType },
      create: { user_id: userId, token: data.token, device_type: data.deviceType },
    });
  }

  async getUserTokens(userId: string): Promise<string[]> {
    const tokens = await this.prisma.notificationToken.findMany({
      where: { user_id: userId },
      select: { token: true },
    });
    return tokens.map((t) => t.token);
  }

  async removeToken(token: string): Promise<void> {
    await this.prisma.notificationToken.deleteMany({
      where: { token },
    });
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId, user_id: userId },
      data: { is_read: true },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    });
  }

  async createNotification(
    userId: string,
    data: { title: string; content: string; type: string; link?: string; metadata?: any },
  ) {
    return this.prisma.notification.create({
      data: {
        user_id: userId,
        title: data.title,
        content: data.content,
        type: data.type,
        link: data.link,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    });
  }
}
