import { Injectable, BadRequestException, UnauthorizedException, Inject } from '@nestjs/common';
import { IUsersRepository } from 'src/api/users/domain/entities/users.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from '../../dto/reset-password.dto';
import { EnvVars } from 'src/config/config.validation';
import { TResetPasswordPayload } from '../../auth.types';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvVars>,
  ) {}

  async execute(dto: ResetPasswordDto) {
    try {
      const payload = await this.jwtService.verifyAsync<TResetPasswordPayload>(dto.token, {
        secret: this.configService.get<string>('RESET_PASSWORD_TOKEN'),
      });

      const user = await this.usersRepository.findById(payload.sub);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      await this.usersRepository.update(user.user_id, { password: dto.new_password });

      return { success: true };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
