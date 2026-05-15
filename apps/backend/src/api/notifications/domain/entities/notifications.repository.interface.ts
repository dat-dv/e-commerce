import { INotificationTokenResponse } from '@ecommerce/shared';
import { SaveTokenDto } from '../../dto/save-token.dto';

export interface INotificationsRepository {
  saveToken(userId: string, data: SaveTokenDto): Promise<INotificationTokenResponse>;
  getUserTokens(userId: string): Promise<string[]>;
  removeToken(token: string): Promise<void>;
}

export const INotificationsRepository = Symbol('INotificationsRepository');
