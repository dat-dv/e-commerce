import { Injectable } from '@nestjs/common';
import { IAuthRepository } from '../entities/auth.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { IRefreshToken } from '../entities/refresh-token.entity';

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

  async removeRefreshToken(token: string): Promise<IRefreshToken | null> {
    return await this.prisma.refreshToken.delete({
      where: { token },
    });
  }

  async findRefreshToken(token: string): Promise<IRefreshToken | null> {
    return this.prisma.refreshToken.findFirst({
      where: { token },
    });
  }
}
