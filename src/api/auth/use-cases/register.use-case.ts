import { Injectable, Inject } from '@nestjs/common';
import { CreateUserUseCase } from 'src/api/users/use-cases/create-user.use-case';
import { IAuthRepository } from '../domain/auth.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from '../dto/register.dto';
import { EnvVars } from 'src/config/config.validation';

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

    // Save refresh token
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await this.authRepository.saveRefreshToken(refreshToken, user.user_id, expiresAt);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
