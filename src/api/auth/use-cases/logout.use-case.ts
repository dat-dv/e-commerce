import { Injectable, Inject } from '@nestjs/common';
import { IAuthRepository } from '../domain/auth.repository.interface';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(refreshToken: string | undefined) {
    if (refreshToken) {
      await this.authRepository.removeRefreshToken(refreshToken);
    }
    return { success: true };
  }
}
