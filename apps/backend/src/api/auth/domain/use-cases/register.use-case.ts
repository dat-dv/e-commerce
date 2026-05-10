import { Injectable, Inject } from '@nestjs/common';
import { CreateUserUseCase } from 'src/api/users/domain/use-cases/create-user.use-case';
import { IAuthRepository } from '../entities/auth.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from '../../dto/register.dto';
import { EnvVars } from 'src/config/config.validation';
import { AUTH_REFRESH_TOKEN_EXPIRES_IN_MS } from 'src/common/constants/auth.constant';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvVars>,
  ) {}

  async execute(dto: RegisterDto) {
    const user = await this.createUserUseCase.execute(dto);
    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
    });

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
      },
    );

    const expiresAt = new Date(Date.now() + AUTH_REFRESH_TOKEN_EXPIRES_IN_MS);
    await this.authRepository.saveRefreshToken(refreshToken, user.id, expiresAt);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
