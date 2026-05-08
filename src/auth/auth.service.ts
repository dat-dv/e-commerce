import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import express from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto, res: express.Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || user.deleted_at) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.password !== dto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.user_id, email: user.email };

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken({ sub: user.user_id });

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user_id: user.user_id,
        expires_at: new Date(Date.now() + Number(this.configService.get('REFRESH_TOKEN_EXPIRES_IN'))),
      },
    });

    const { password, ...userResponse } = user;

    // Set cookies
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
    });

    return userResponse;
  }

  async logout(req: express.Request, res: express.Response) {
    const refreshToken = req.cookies['refresh_token'] as string | undefined;

    if (refreshToken) {
      await this.removeRefreshToken(refreshToken);
    }

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return true;
  }

  async removeRefreshToken(refreshToken: string) {
    try {
      await this.prisma.refreshToken.delete({
        where: { token: refreshToken },
      });
    } catch (error) {
      // Token might already be deleted or invalid
    }
    return { success: true };
  }

  private async generateAccessToken(payload: { sub: string; email: string }) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
    });
  }

  private async generateRefreshToken(payload: { sub: string }) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
    });
  }

  /**
   * Check JWT token is expired
   * @param token JWT token
   * @returns boolean | true = not expired, false = expired
   */
  private async checkJWTTokenIsExpired(token: string) {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check refresh token is expired
   * @param token refresh token
   * @returns boolean | true = not expired, false = expired
   */
  private async checkRefreshTokenIsExpired(token: string) {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });
      const refreshToken = await this.prisma.refreshToken.findUnique({
        where: { token },
      });
      if (!refreshToken || refreshToken.expires_at < new Date()) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
