import { IRefreshToken } from '@ecommerce/shared';

export interface IAuthRepository {
  saveRefreshToken(token: string, userId: string, expiresAt: Date): Promise<void>;
  removeRefreshToken(token: string): Promise<IRefreshToken | null>;
  findRefreshToken(token: string): Promise<IRefreshToken | null>;
}

export const IAuthRepository = Symbol('IAuthRepository');
