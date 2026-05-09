import { Prisma } from 'generated/prisma/client';

export interface IAuthRepository {
  saveRefreshToken(token: string, userId: string, expiresAt: Date): Promise<void>;
  removeRefreshToken(token: string): Promise<void>;
  findRefreshToken(token: string): Promise<Prisma.RefreshTokenGetPayload<Record<string, never>> | null>;
}

export const IAuthRepository = Symbol('IAuthRepository');
