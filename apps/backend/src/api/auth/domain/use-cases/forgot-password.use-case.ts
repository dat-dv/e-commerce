import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IUsersRepository } from 'src/api/users/domain/entities/users.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { ForgotPasswordDto } from '../../dto/forgot-password.dto';
import { EnvVars } from 'src/config/config.validation';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvVars>,
    private readonly mailService: MailService,
  ) {}

  async execute(dto: ForgotPasswordDto) {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const resetToken = await this.jwtService.signAsync(
      { sub: user.user_id },
      {
        secret: this.configService.get('RESET_PASSWORD_TOKEN'),
        expiresIn: this.configService.get('RESET_PASSWORD_TOKEN_EXPIRES_IN'),
      },
    );

    const resetLink = `${this.configService.get<string>('FE_URL')}/reset-password?token=${resetToken}`;

    await this.mailService.sendMail(user.email, 'Reset Password', `Click here to reset password: ${resetLink}`);

    return { success: true };
  }
}
