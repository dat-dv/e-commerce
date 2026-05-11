import { Injectable, BadRequestException, UnauthorizedException, Inject } from '@nestjs/common';
import { IUsersRepository } from 'src/api/users/domain/entities/users.repository.interface';
import { ResetPasswordDto } from '../../dto/reset-password.dto';
import { TokenService } from 'src/shared/services/token/token.service';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: ResetPasswordDto) {
    try {
      const payload = await this.tokenService.verifyResetPasswordToken(dto.token);
      const user = await this.usersRepository.findById(payload?.userId);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      await this.usersRepository.update(user.id, { password: dto.new_password });

      return { success: true };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
