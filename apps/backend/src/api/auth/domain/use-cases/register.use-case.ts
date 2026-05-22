import { Injectable, Inject } from '@nestjs/common';
import { CreateUserUseCase } from 'src/api/users/domain/use-cases/create-user.use-case';
import { IAuthRepository } from '../entities/auth.repository.interface';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from '../../dto/register.dto';
import { EnvVars } from 'src/config/config.validation';
import { TokenService } from 'src/shared/services/token/token.service';

import { ICartRepository } from 'src/api/cart/domain/entities/cart.repository.interface';

import { IRegisterResponse } from '@ecommerce/shared';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
    @Inject(ICartRepository)
    private readonly cartRepository: ICartRepository,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService<EnvVars>,
  ) {}

  async execute(dto: RegisterDto): Promise<{ user: IRegisterResponse; accessToken: string; refreshToken: string }> {
    const user = await this.createUserUseCase.execute(dto);

    await this.cartRepository.createCart(user.id);
    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.tokenService.generateAccessToken(payload);

    const refreshToken = await this.tokenService.generateRefreshToken(payload);

    const expiresAt = new Date(
      Date.now() + this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN', { infer: true }) * 1000,
    );
    await this.authRepository.saveRefreshToken(refreshToken, user.id, expiresAt);

    return {
      user: user,
      accessToken,
      refreshToken,
    };
  }
}
