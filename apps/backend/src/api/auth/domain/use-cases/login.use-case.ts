import { Injectable, UnauthorizedException, Inject, BadRequestException } from '@nestjs/common';
import { IUsersRepository } from 'src/api/users/domain/entities/users.repository.interface';
import { IAuthRepository } from '../entities/auth.repository.interface';
import { LoginDto } from '../../dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/config/config.validation';
import { TokenService } from 'src/shared/services/token/token.service';
import { verifyPassword } from 'src/common/utils/password.util';

import { ILoginResponse } from '@ecommerce/shared';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService<EnvVars>,
  ) {}

  async execute(dto: LoginDto): Promise<{ user: ILoginResponse; accessToken: string; refreshToken: string }> {
    const user = await this.usersRepository.findByEmail(dto.email);

    if (!user || user.deleted_at) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!verifyPassword(dto.password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.tokenService.generateAccessToken(payload);

    const refreshToken = await this.tokenService.generateRefreshToken({
      sub: user.id,
      email: user.email,
    });

    const expiresAt = new Date(
      Date.now() + this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN', { infer: true }) * 1000,
    );
    await this.authRepository.saveRefreshToken(refreshToken, user.id, expiresAt);

    // Bóc tách để loại bỏ các trường nhạy cảm

    const { password, ...userResponse } = user;

    return { user: userResponse, accessToken, refreshToken };
  }
}
