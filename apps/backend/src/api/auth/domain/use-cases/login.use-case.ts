import { Injectable, UnauthorizedException, Inject, BadRequestException } from '@nestjs/common';
import { IUsersRepository } from 'src/api/users/domain/entities/users.repository.interface';
import { IAuthRepository } from '../entities/auth.repository.interface';
import { LoginDto } from '../../dto/login.dto';
import { AUTH_REFRESH_TOKEN_EXPIRES_IN_MS } from 'src/common/constants/auth.constant';
import { TokenService } from 'src/shared/services/token/token.service';
import * as crypto from 'crypto';

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
    const user = await this.usersRepository.findByEmail(dto.email, true);

    if (!user || user.deleted_at) {
      throw new BadRequestException('Invalid credentials');
    }

    if (user.salt) {
      const hash = crypto.pbkdf2Sync(dto.password, user.salt, 1000, 64, 'sha512').toString('hex');
      if (user.password !== hash) {
        throw new BadRequestException('Invalid credentials');
      }
    } else {
      if (user.password !== dto.password) {
        throw new BadRequestException('Invalid credentials');
      }
    }

    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.tokenService.generateAccessToken(payload);

    const refreshToken = await this.tokenService.generateRefreshToken({
      sub: user.id,
      email: user.email,
    });

    const expiresAt = new Date(Date.now() + AUTH_REFRESH_TOKEN_EXPIRES_IN_MS);
    await this.authRepository.saveRefreshToken(refreshToken, user.id, expiresAt);

    const { password, salt, ...userResponse } = user;

    return { user: userResponse, accessToken, refreshToken };
  }
}
