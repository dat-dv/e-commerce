import {
  INotificationTokenResponse,
  INotificationResponse,
  INotificationListResponse,
  NotificationMetadata,
} from '@ecommerce/shared';
import { SaveTokenDto } from '../../dto/save-token.dto';

export interface CreateNotificationInput {
  title: string;
  content: string;
  type: number;
  link?: string;
  metadata?: NotificationMetadata;
}

export interface INotificationsRepository {
  saveToken(userId: string, data: SaveTokenDto): Promise<INotificationTokenResponse>;
  getUserTokens(userId: string): Promise<string[]>;
  removeToken(token: string): Promise<void>;

  // Notification History
  getNotifications(userId: string, page?: number, limit?: number): Promise<INotificationListResponse>;
  countUnread(userId: string): Promise<number>;
  markAsRead(userId: string, notificationId: string): Promise<INotificationResponse>;
  markAllAsRead(userId: string): Promise<void>;
  createNotification(userId: string, data: CreateNotificationInput): Promise<INotificationResponse>;
}

export const INotificationsRepository = Symbol('INotificationsRepository');
