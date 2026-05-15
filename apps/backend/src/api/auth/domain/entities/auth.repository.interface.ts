import { RefreshToken } from '../../../../../generated/prisma/client';

export interface IAuthRepository {
  saveRefreshToken(token: string, userId: string, expiresAt: Date): Promise<void>;
  removeRefreshToken(token: string): Promise<RefreshToken | null>;
  findRefreshToken(token: string): Promise<RefreshToken | null>;
}

export const IAuthRepository = Symbol('IAuthRepository');
