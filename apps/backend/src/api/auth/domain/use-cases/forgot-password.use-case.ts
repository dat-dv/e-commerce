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
<div style="margin:0;padding:0;background:#f1f5f9;padding:40px 16px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        
        <table 
          width="100%" 
          cellpadding="0" 
          cellspacing="0" 
          border="0"
          style="
            max-width:600px;
            background:#ffffff;
            border-radius:28px;
            overflow:hidden;
            border:1px solid #e2e8f0;
            box-shadow:0 10px 40px rgba(15,23,42,0.08);
            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
          "
        >
          
          <!-- Header -->
          <tr>
            <td
              style="
                background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);
                padding:48px 40px;
                text-align:center;
              "
            >
              <div
                style="
                  width:64px;
                  height:64px;
                  line-height:64px;
                  margin:0 auto 20px;
                  border-radius:20px;
                  background:rgba(255,255,255,0.1);
                  font-size:30px;
                "
              >
                🔐
              </div>

              <div
                style="
                  color:#ffffff;
                  font-size:30px;
                  font-weight:800;
                  letter-spacing:-0.04em;
                  margin-bottom:12px;
                "
              >
                Reset Password
              </div>

              <div
                style="
                  color:rgba(255,255,255,0.75);
                  font-size:16px;
                  line-height:1.7;
                  max-width:420px;
                  margin:0 auto;
                "
              >
                We received a request to reset your password.
                Click the button below to continue securely.
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 40px 32px;">
              
              <div
                style="
                  background:#f8fafc;
                  border:1px solid #e2e8f0;
                  border-radius:20px;
                  padding:24px;
                  margin-bottom:32px;
                "
              >
                <div
                  style="
                    color:#0f172a;
                    font-size:15px;
                    line-height:1.8;
                  "
                >
                  This password reset link will expire in
                  <strong>15 minutes</strong> for security reasons.
                </div>
              </div>

              <div style="text-align:center;margin-bottom:36px;">
                <a
                  href="${resetLink}"
                  style="
                    display:inline-block;
                    background:#0f172a;
                    color:#ffffff;
                    text-decoration:none;
                    padding:16px 36px;
                    border-radius:14px;
                    font-size:16px;
                    font-weight:700;
                    box-shadow:0 6px 20px rgba(15,23,42,0.25);
                  "
                >
                  Reset Password
                </a>
              </div>

              <div
                style="
                  color:#64748b;
                  font-size:14px;
                  line-height:1.8;
                  text-align:center;
                "
              >
                If you didn’t request a password reset,
                you can safely ignore this email.
              </div>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:#e2e8f0;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 40px 40px;text-align:center;">
              
              <div
                style="
                  color:#94a3b8;
                  font-size:13px;
                  line-height:1.8;
                  margin-bottom:16px;
                "
              >
                If the button above doesn't work, copy and paste
                this link into your browser:
              </div>

              <a
                href="${resetLink}"
                style="
                  color:#0f172a;
                  font-size:13px;
                  word-break:break-all;
                  text-decoration:underline;
                "
              >
                ${resetLink}
              </a>

              <div
                style="
                  margin-top:32px;
                  color:#94a3b8;
                  font-size:12px;
                "
              >
                © 2026 E-Commerce. All rights reserved.
              </div>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</div>
`;

    return html;
  };
}
