import { Injectable } from '@nestjs/common';
import { IAuthRepository } from '../domain/auth.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveRefreshToken(token: string, userId: string, expiresAt: Date): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        token,
        user_id: userId,
        expires_at: expiresAt,
      },
    });
  }

  async removeRefreshToken(token: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { token },
    });
  }

  async findRefreshToken(token: string): Promise<Prisma.RefreshTokenGetPayload<Record<string, never>> | null> {
    return this.prisma.refreshToken.findFirst({
      where: { token },
    });
  }
}
