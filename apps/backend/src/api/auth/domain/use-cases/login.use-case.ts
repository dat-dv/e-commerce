import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { IUsersRepository } from 'src/api/users/domain/entities/users.repository.interface';
import { IAuthRepository } from '../entities/auth.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../../dto/login.dto';
import { EnvVars } from 'src/config/config.validation';
import { AUTH_REFRESH_TOKEN_EXPIRES_IN_MS } from 'src/common/constants/auth.constant';
import { TokenService } from 'src/shared/services/token/token.service';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.usersRepository.findByEmail(dto.email);

    if (!user || user.deleted_at) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.password !== dto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.tokenService.generateAccessToken(payload);

    const refreshToken = await this.tokenService.generateRefreshToken({
      sub: user.id,
      email: user.email,
    });

    const expiresAt = new Date(Date.now() + AUTH_REFRESH_TOKEN_EXPIRES_IN_MS);
    await this.authRepository.saveRefreshToken(refreshToken, user.id, expiresAt);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
