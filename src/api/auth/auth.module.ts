import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/api/users/users.module';
import { MailModule } from 'src/mail/mail.module';
import { LoginUseCase } from './use-cases/login.use-case';
import { RegisterUseCase } from './use-cases/register.use-case';
import { LogoutUseCase } from './use-cases/logout.use-case';
import { ForgotPasswordUseCase } from './use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from './use-cases/reset-password.use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { IAuthRepository } from './domain/auth.repository.interface';
import { AuthRepository } from './infrastructure/auth.repository';

@Module({
  imports: [JwtModule, forwardRef(() => UsersModule), MailModule],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    LogoutUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    RefreshTokenUseCase,
    {
      provide: IAuthRepository,
      useClass: AuthRepository,
    },
  ],
  exports: [
    LoginUseCase,
    RegisterUseCase,
    LogoutUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    RefreshTokenUseCase,
    IAuthRepository,
  ],
})
export class AuthModule {}
