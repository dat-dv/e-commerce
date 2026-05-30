import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from '../entities/auth.repository.interface';
import { IRefreshTokenResponse } from '@ecommerce/shared';
import { ICacheService } from 'src/shared/services/cache/cache.interface';
import { CacheKeys } from 'src/shared/services/cache/cache-keys';
import { createHash } from 'crypto';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @Inject(ICacheService)
    private readonly cacheService: ICacheService,
  ) {}

  async saveRefreshToken(token: string, userId: string, expiresAt: Date): Promise<void> {
    const ttlSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);

    if (ttlSeconds <= 0) {
      return;
    }

    const now = new Date();
    const refreshToken: IRefreshTokenResponse = {
      user_id: userId,
      expires_at: expiresAt,
      created_at: now,
      updated_at: now,
    };

    await this.cacheService.set(this.getRefreshTokenKey(token), JSON.stringify(refreshToken), ttlSeconds);
  }

  async removeRefreshToken(token: string): Promise<IRefreshTokenResponse | null> {
    const cacheKey = this.getRefreshTokenKey(token);
    const refreshToken = await this.findRefreshToken(token);

    await this.cacheService.delete(cacheKey);

    return refreshToken;
  }

  async findRefreshToken(token: string): Promise<IRefreshTokenResponse | null> {
    const cached = await this.cacheService.get(this.getRefreshTokenKey(token));
    if (!cached) {
      return null;
    }

    const parsed = JSON.parse(cached) as IRefreshTokenResponse;

    return {
      ...parsed,
      expires_at: new Date(parsed.expires_at),
      created_at: new Date(parsed.created_at),
      updated_at: new Date(parsed.updated_at),
    };
  }

  private getRefreshTokenKey(token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    return CacheKeys.refreshToken(tokenHash);
  }
}
