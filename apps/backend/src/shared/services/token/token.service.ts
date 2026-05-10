import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/config/config.validation';
import { TAccessTokenPayload, TRefreshTokenPayload } from '../../../api/auth/auth.types';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvVars>,
  ) {}

  async verifyAccessToken(accessToken: string) {
    return this.jwtService.verifyAsync<TAccessTokenPayload>(accessToken, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async verifyRefreshToken(refreshToken: string) {
    return this.jwtService.verifyAsync<TRefreshTokenPayload>(refreshToken, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
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
}
