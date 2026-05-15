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
}
