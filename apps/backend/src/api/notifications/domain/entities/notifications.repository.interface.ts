import { NotificationToken } from 'generated/prisma/client';

export interface INotificationsRepository {
  saveToken(userId: string, token: string, deviceType?: string): Promise<NotificationToken>;
  getUserTokens(userId: string): Promise<string[]>;
  removeToken(token: string): Promise<void>;
}

export const INotificationsRepository = Symbol('INotificationsRepository');
