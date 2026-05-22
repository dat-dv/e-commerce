import {
  INotificationListResponse,
  INotificationResponse,
  INotificationTokenResponse,
  NotificationMetadata,
} from '@ecommerce/shared';
import { GetNotificationsDto } from '../../dto/get-notifications.dto';
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
  getNotifications(userId: string, query?: GetNotificationsDto): Promise<INotificationListResponse>;
  countUnread(userId: string): Promise<number>;
  markAsRead(userId: string, notificationId: string): Promise<INotificationResponse>;
  markAllAsRead(userId: string): Promise<void>;
  createNotification(userId: string, data: CreateNotificationInput): Promise<INotificationResponse>;
}

export const INotificationsRepository = Symbol('INotificationsRepository');
