import { Injectable, Inject } from '@nestjs/common';
import { CreateUserUseCase } from 'src/api/users/domain/use-cases/create-user.use-case';
import { IAuthRepository } from '../entities/auth.repository.interface';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from '../../dto/register.dto';
import { EnvVars } from 'src/config/config.validation';
import { AUTH_REFRESH_TOKEN_EXPIRES_IN_MS } from 'src/common/constants/auth.constant';
import { TokenService } from 'src/shared/services/token/token.service';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService<EnvVars>,
  ) {}

  async execute(dto: RegisterDto) {
    const user = await this.createUserUseCase.execute({
      ...dto,
      first_name: '',
      last_name: '',
    });
    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.tokenService.generateAccessToken(payload);

    const refreshToken = await this.tokenService.generateRefreshToken(payload);

    const expiresAt = new Date(Date.now() + AUTH_REFRESH_TOKEN_EXPIRES_IN_MS);
    await this.authRepository.saveRefreshToken(refreshToken, user.id, expiresAt);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
