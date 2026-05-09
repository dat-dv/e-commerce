import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { IUsersRepository } from 'src/api/users/domain/users.repository.interface';
import { IAuthRepository } from '../domain/auth.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../dto/login.dto';
import { EnvVars } from 'src/config/config.validation';
import { AUTH_REFRESH_TOKEN_EXPIRES_IN_MS } from 'src/common/constants/auth.constant';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvVars>,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.usersRepository.findByEmail(dto.email);

    if (!user || user.deleted_at) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.password !== dto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.user_id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
    });

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.user_id },
      {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
      },
    );

    const expiresAt = new Date(Date.now() + AUTH_REFRESH_TOKEN_EXPIRES_IN_MS);
    await this.authRepository.saveRefreshToken(refreshToken, user.user_id, expiresAt);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
