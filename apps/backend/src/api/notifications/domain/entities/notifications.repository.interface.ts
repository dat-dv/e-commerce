import { INotificationTokenResponse, INotificationResponse } from '@ecommerce/shared';
import { SaveTokenDto } from '../../dto/save-token.dto';

export interface INotificationsRepository {
  saveToken(userId: string, data: SaveTokenDto): Promise<INotificationTokenResponse>;
  getUserTokens(userId: string): Promise<string[]>;
  removeToken(token: string): Promise<void>;

  // Notification History
  getNotifications(userId: string): Promise<INotificationResponse[]>;
  markAsRead(userId: string, notificationId: string): Promise<INotificationResponse>;
  markAllAsRead(userId: string): Promise<void>;
  createNotification(
    userId: string,
    data: { title: string; content: string; type: number; link?: string; metadata?: any },
  ): Promise<INotificationResponse>;
}

export const INotificationsRepository = Symbol('INotificationsRepository');
