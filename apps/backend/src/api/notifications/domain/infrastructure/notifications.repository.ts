import { Injectable } from '@nestjs/common';
import { INotificationsRepository } from '../entities/notifications.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { NotificationToken } from 'generated/prisma/client';

@Injectable()
export class NotificationsRepository implements INotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveToken(userId: string, token: string, deviceType?: string): Promise<NotificationToken> {
    return this.prisma.notificationToken.upsert({
      where: { token },
      update: { user_id: userId, device_type: deviceType },
      create: { user_id: userId, token, device_type: deviceType },
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
}
