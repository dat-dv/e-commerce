import { Injectable } from '@nestjs/common';
import { CreateNotificationInput, INotificationsRepository } from '../entities/notifications.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import {
  INotificationListResponse,
  INotificationResponse,
  INotificationTokenResponse,
  NotificationMetadata,
  NotificationMetadataValue,
} from '@ecommerce/shared';
import { SaveTokenDto } from '../../dto/save-token.dto';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';

type PersistedNotification = Omit<INotificationResponse, 'metadata'> & {
  metadata: string | null;
};

@Injectable()
export class NotificationsRepository implements INotificationsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

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

  async getNotifications(userId: string, page = 1, limit = 10): Promise<INotificationListResponse> {
    const result = await this.paginationService.paginate<
      Parameters<typeof this.prisma.notification.findMany>[0],
      PersistedNotification[]
    >(
      this.prisma.notification,
      {
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
      },
      page,
      limit,
    );

    return {
      ...result,
      items: result.items.map((i) => this.mapNotification(i)),
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.update({
      where: { id: notificationId, user_id: userId },
      data: { is_read: true },
    });

    return this.mapNotification(notification);
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    });
  }

  async createNotification(userId: string, data: CreateNotificationInput) {
    const notification = await this.prisma.notification.create({
      data: {
        user_id: userId,
        title: data.title,
        content: data.content,
        type: data.type,
        link: data.link,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    });

    return this.mapNotification(notification);
  }

  private isNotificationMetadataValue(value: unknown): value is NotificationMetadataValue {
    if (value === null) return true;

    const valueType = typeof value;
    if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
      return true;
    }

    if (Array.isArray(value)) {
      return value.every((v) => this.isNotificationMetadataValue(v));
    }

    if (valueType === 'object') {
      return Object.values(value as Record<string, unknown>).every((v) => this.isNotificationMetadataValue(v));
    }

    return false;
  }
  private parseNotificationMetadata(metadata: string | null): NotificationMetadata | null {
    if (!metadata) return null;

    try {
      const parsed: unknown = JSON.parse(metadata);

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return null;
      }

      const metadataRecord = parsed as Record<string, unknown>;
      if (!Object.values(metadataRecord).every((v) => this.isNotificationMetadataValue(v))) {
        return null;
      }

      return metadataRecord as NotificationMetadata;
    } catch {
      return null;
    }
  }
  private mapNotification(notification: PersistedNotification): INotificationResponse {
    return {
      ...notification,
      metadata: this.parseNotificationMetadata(notification.metadata),
    };
  }
}
