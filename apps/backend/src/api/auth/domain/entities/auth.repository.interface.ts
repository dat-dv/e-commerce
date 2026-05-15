import type { IRefreshTokenResponse } from '@ecommerce/shared';

export interface IAuthRepository {
  saveRefreshToken(token: string, userId: string, expiresAt: Date): Promise<void>;
  removeRefreshToken(token: string): Promise<IRefreshTokenResponse | null>;
  findRefreshToken(token: string): Promise<IRefreshTokenResponse | null>;
}

export const IAuthRepository = Symbol('IAuthRepository');
