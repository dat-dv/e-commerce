import { Injectable, UnauthorizedException, Inject, BadRequestException } from '@nestjs/common';
import { IAuthRepository } from '../entities/auth.repository.interface';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/config/config.validation';
import { AUTH_REFRESH_TOKEN_EXPIRES_IN_MS } from 'src/common/constants/auth.constant';
import { TokenService } from 'src/shared/services/token/token.service';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService<EnvVars>,
  ) {}

  async execute(refreshToken: string | undefined) {
    if (!refreshToken) {
      throw new BadRequestException('Invalid or expired refresh token');
    }

    try {
      const isValidRT = await this.tokenService.verifyRefreshToken(refreshToken);

      const dbToken = await this.authRepository.findRefreshToken(refreshToken);
      if (!dbToken) {
        throw new BadRequestException('Invalid or expired refresh token');
      }

      await this.authRepository.removeRefreshToken(refreshToken);

      const payload = { sub: dbToken.user_id, email: isValidRT.email };

      const newRefreshToken = await this.tokenService.generateRefreshToken(payload);
      const newAccessToken = await this.tokenService.generateAccessToken(payload);

      const expiresAt = new Date(Date.now() + AUTH_REFRESH_TOKEN_EXPIRES_IN_MS);
      await this.authRepository.saveRefreshToken(newRefreshToken, payload.sub, expiresAt);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new BadRequestException('Invalid or expired refresh token');
    }
  }
}
