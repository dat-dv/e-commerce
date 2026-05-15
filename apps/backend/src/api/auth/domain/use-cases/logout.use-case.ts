import { Injectable, Inject } from '@nestjs/common';
import { IAuthRepository } from '../entities/auth.repository.interface';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(refreshToken: string | undefined): Promise<boolean> {
    if (refreshToken) {
      await this.authRepository.removeRefreshToken(refreshToken);
    }
    return true;
  }
}
