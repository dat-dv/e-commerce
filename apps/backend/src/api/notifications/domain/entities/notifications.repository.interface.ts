import { INotificationTokenResponse } from '@ecommerce/shared';

export interface INotificationsRepository {
  saveToken(userId: string, token: string, deviceType?: string): Promise<INotificationTokenResponse>;
  getUserTokens(userId: string): Promise<string[]>;
  removeToken(token: string): Promise<void>;
}

export const INotificationsRepository = Symbol('INotificationsRepository');
