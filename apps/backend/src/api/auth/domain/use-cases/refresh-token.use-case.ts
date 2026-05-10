import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { IAuthRepository } from '../entities/auth.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/config/config.validation';
import { TAccessTokenPayload } from '../../auth.types';
import { AUTH_REFRESH_TOKEN_EXPIRES_IN_MS } from 'src/common/constants/auth.constant';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvVars>,
  ) {}

  async execute(accessToken: string | undefined, refreshToken: string | undefined) {
    if (!accessToken) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    try {
      const decodedAT = await this.jwtService.verifyAsync<TAccessTokenPayload>(accessToken, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });

      const isValidRT = await this.jwtService.verifyAsync<{ sub: string }>(refreshToken, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });

      const dbToken = await this.authRepository.findRefreshToken(refreshToken);
      if (!dbToken) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      await this.authRepository.removeRefreshToken(refreshToken);

      const newRefreshToken = await this.jwtService.signAsync(
        { sub: decodedAT.sub },
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
        },
      );

      const newAccessToken = await this.jwtService.signAsync(
        { sub: decodedAT.sub, email: decodedAT.email },
        {
          secret: this.configService.get('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
        },
      );

      const expiresAt = new Date(Date.now() + AUTH_REFRESH_TOKEN_EXPIRES_IN_MS);
      await this.authRepository.saveRefreshToken(newRefreshToken, decodedAT.sub, expiresAt);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
