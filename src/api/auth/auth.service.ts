import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import express from 'express';
import { TAccessTokenPayload, TRefreshTokenPayload, TResetPasswordPayload } from './auth.types';
import { CreateUserUseCase } from 'src/api/users/use-cases/create-user.use-case';
import { RegisterDto } from './dto/register.dto';
import { MailService } from 'src/mail/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EnvVars } from 'src/config/config.validation';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvVars>,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly mailService: MailService,
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
        expires_at: new Date(
          Date.now() + this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN', { infer: true }) * 1000,
        ),
      },
    });

    const { password, ...userResponse } = user;

    // Set cookies
    this.setAccessTokenCookies(accessToken, res);
    this.setRefreshTokenCookies(refreshToken, res);

    return userResponse;
  }

  async register(dto: RegisterDto, res: express.Response) {
    const user = await this.createUserUseCase.execute(dto);
    const payload = { sub: user.user_id, email: user.email };
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken({ sub: user.user_id });

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user_id: user.user_id,
        expires_at: new Date(
          Date.now() + (this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN', { infer: true }) ?? 0) * 1000,
        ),
      },
    });

    this.setAccessTokenCookies(accessToken, res);
    this.setRefreshTokenCookies(refreshToken, res);

    const { password, ...userResponse } = user;
    return userResponse;
  }

  async logout(req: Express.Request, res: express.Response) {
    const refreshToken = req.cookies['refresh_token'];
    res.clearCookie('access_token');
    if (refreshToken) {
      await this.removeRefreshToken(refreshToken);
      res.clearCookie('refresh_token');
      return true;
    } else {
      return false;
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email, deleted_at: null },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.deleted_at) {
      throw new BadRequestException('Account has been deleted');
    }

    // Generate a short-lived reset token (JWT)
    const payload: TResetPasswordPayload = { sub: user.user_id, email: user.email };
    const resetToken = await this.generateResetPasswordToken(payload);
    const resetLink = `${this.configService.get<string>('FE_URL')}/reset-password?token=${resetToken}`;
    const text = `Click the link to reset your password: ${resetLink}`;
    const html = `<p>Click the link to reset your password: <a href="${resetLink}">Reset Password</a></p>`;

    try {
      await this.mailService.sendMail(user.email, 'Password Reset', text, html);
    } catch (error) {
      throw new BadRequestException('Failed to send email');
    }

    return { message: 'If an account exists with this email, a reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const payload = await this.jwtService.verifyAsync<TResetPasswordPayload>(dto.token, {
        secret: this.configService.get<string>('RESET_PASSWORD_TOKEN'),
      });

      await this.prisma.user.update({
        where: { user_id: payload.sub },
        data: { password: dto.new_password },
      });

      return { message: 'Password has been reset successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async refreshToken(req: Express.Request, res: express.Response) {
    try {
      const accessToken = req.cookies['access_token'];
      const decodedAT = await this.isValidAccessToken(accessToken || '');
      if (!decodedAT) {
        throw new UnauthorizedException('Invalid or expired access token');
      }
      const refreshToken = req.cookies['refresh_token'];
      if (!refreshToken) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
      const isValidRT = await this.isValidRefreshToken(refreshToken);
      if (!isValidRT) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
      await this.removeRefreshToken(refreshToken);
      const newRefreshToken = await this.generateRefreshToken({ sub: decodedAT.sub });
      const newAccessToken = await this.generateAccessToken({ sub: decodedAT.sub, email: decodedAT.email });
      await this.saveRefreshToken(newRefreshToken, decodedAT.sub);
      // Set cookies
      this.setAccessTokenCookies(newAccessToken, res);
      this.setRefreshTokenCookies(newRefreshToken, res);

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async saveRefreshToken(refreshToken: string, userId: string) {
    if (!refreshToken || !userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user_id: userId,
        expires_at: new Date(
          Date.now() + (this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN', { infer: true }) ?? 0) * 1000,
        ),
      },
    });
  }

  async removeRefreshToken(refreshToken: string) {
    try {
      await this.prisma.refreshToken.delete({
        where: { token: refreshToken },
      });
    } catch (error) {
      throw new BadRequestException('Invalid or expired refresh token');
    }
    return { success: true };
  }

  async generateResetPasswordToken(payload: TResetPasswordPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('RESET_PASSWORD_TOKEN'),
      expiresIn: this.configService.get('RESET_PASSWORD_TOKEN_EXPIRES_IN'),
    });
  }

  async generateAccessToken(payload: TAccessTokenPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
    });
  }

  async generateRefreshToken(payload: TRefreshTokenPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
    });
  }

  async isValidAccessToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<TAccessTokenPayload>(token, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  async isValidRefreshToken(token: string) {
    try {
      await this.jwtService.verifyAsync<TRefreshTokenPayload>(token, {
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
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  setAccessTokenCookies(accessToken: string, res: express.Response) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.configService.get<number>('ACCESS_TOKEN_EXPIRES_IN', { infer: true }) * 1000,
    });
  }

  setRefreshTokenCookies(refreshToken: string, res: express.Response) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN', { infer: true }) * 1000,
    });
  }
}
