import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IUsersRepository } from 'src/api/users/domain/entities/users.repository.interface';
import { TokenService } from 'src/shared/services/token/token.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { ForgotPasswordDto } from '../../dto/forgot-password.dto';
import { EnvVars } from 'src/config/config.validation';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService<EnvVars>,
    private readonly mailService: MailService,
  ) {}

  async execute(dto: ForgotPasswordDto) {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const resetToken = await this.tokenService.generateResetPasswordToken({ userId: user.id });

    const resetLink = `${this.configService.get<string>('FE_URL')}/reset-password?token=${resetToken}`;

    const html = `
<div style="font-family: 'Outfit', 'Roboto', sans-serif; background-color: #f8fafc; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid rgba(0, 0, 0, 0.05);">
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.05em;">E-COMMERCE</div>
    </div>
    <div style="font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 10px; text-align: center;">Reset Your Password</div>
    <div style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 30px; text-align: center;">
      We received a request to reset the password for your account. Click the button below to proceed.
    </div>
    <div style="text-align: center; margin-bottom: 30px;">
      <a href="${resetLink}" style="display: inline-block; background-color: #0f172a; color: #ffffff !important; padding: 14px 32px; border-radius: 12px; font-weight: 600; text-decoration: none;">Reset Password</a>
    </div>
    <div style="font-size: 14px; line-height: 1.6; color: #475569; text-align: center; margin-bottom: 30px;">
      If you did not request a password reset, you can safely ignore this email. This link will expire in 15 minutes.
    </div>
    <div style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 40px;">
      &copy; 2026 E-Commerce. All rights reserved.<br>
      If you're having trouble clicking the button, copy and paste this link into your browser: <br>
      <a href="${resetLink}" style="color: #0f172a; text-decoration: underline;">${resetLink}</a>
    </div>
  </div>
</div>
    `;

    await this.mailService.sendMail(user.email, 'Reset Password', `Click here to reset password: ${resetLink}`, html);

    return { success: true };
  }
}
