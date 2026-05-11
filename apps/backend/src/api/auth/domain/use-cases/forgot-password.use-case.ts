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

    const html = this.generateResetPasswordTemplate(resetLink);

    await this.mailService.sendMail(user.email, 'Reset Password', `Click here to reset password: ${resetLink}`, html);

    return { success: true };
  }

  generateResetPasswordTemplate = (resetLink: string) => {
    const html = `
<div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; color: #333;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h2 style="font-size: 24px; font-weight: 700; color: #111; margin-bottom: 10px;">Reset Your Password</h2>
    <p style="font-size: 15px; color: #666; line-height: 1.6;">You requested to reset your password. Click the button below to set a new one.</p>
  </div>
  
  <div style="text-align: center; margin-bottom: 30px;">
    <a href="${resetLink}" style="display: inline-block; background-color: #0f172a; color: #ffffff !important; padding: 14px 28px; border-radius: 8px; font-size: 15px; font-weight: 600; text-decoration: none;">Reset Password</a>
  </div>
  
  <p style="font-size: 13px; color: #999; text-align: center;">This link will expire in 15 minutes. If you didn't request this, you can ignore this email.</p>
  
  <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
  
  <p style="font-size: 12px; color: #bbb; text-align: center;">© 2026 Shop.hub. All rights reserved.</p>
</div>
`;

    return html;
  };
}
