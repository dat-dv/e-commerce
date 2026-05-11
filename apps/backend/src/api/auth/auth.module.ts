import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/api/users/users.module';
import { MailModule } from 'src/mail/mail.module';
import { LoginUseCase } from './domain/use-cases/login.use-case';
import { RegisterUseCase } from './domain/use-cases/register.use-case';
import { LogoutUseCase } from './domain/use-cases/logout.use-case';
import { ForgotPasswordUseCase } from './domain/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from './domain/use-cases/reset-password.use-case';
import { RefreshTokenUseCase } from './domain/use-cases/refresh-token.use-case';
import { GetMeUseCase } from './domain/use-cases/get-me.use-case';
import { VerifyPhoneUseCase } from './domain/use-cases/verify-phone.use-case';
import { ChangePasswordUseCase } from './domain/use-cases/change-password.use-case';
import { IAuthRepository } from './domain/entities/auth.repository.interface';
import { AuthRepository } from './domain/infrastructure/auth.repository';
import { TokenService } from '../../shared/services/token/token.service';

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
    GetMeUseCase,
    VerifyPhoneUseCase,
    ChangePasswordUseCase,
    TokenService,
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
    GetMeUseCase,
    VerifyPhoneUseCase,
    ChangePasswordUseCase,
    TokenService,
    IAuthRepository,
    JwtModule,
  ],
})
export class AuthModule {}
