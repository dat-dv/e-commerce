import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  UseGuards,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import createSuccessResponse from 'src/common/respomse';
import { LoginUseCase } from './domain/use-cases/login.use-case';
import { RegisterUseCase } from './domain/use-cases/register.use-case';
import { LogoutUseCase } from './domain/use-cases/logout.use-case';
import { ForgotPasswordUseCase } from './domain/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from './domain/use-cases/reset-password.use-case';
import { RefreshTokenUseCase } from './domain/use-cases/refresh-token.use-case';
import { GetMeUseCase } from './domain/use-cases/get-me.use-case';
import { VerifyPhoneUseCase } from './domain/use-cases/verify-phone.use-case';
import { ChangePasswordUseCase } from './domain/use-cases/change-password.use-case';
import { AuthGuard } from './guards/auth.guard';
import { ConfigService } from '@nestjs/config';
import { IApiResponse, IAuthMeResponse, ILoginResponse, IRegisterResponse } from '@ecommerce/shared';
import { EnvVars } from 'src/config/config.validation';
import type { TAppRequest } from 'src/shared/types/request.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly verifyPhoneUseCase: VerifyPhoneUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly configService: ConfigService<EnvVars>,
  ) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Req() req: Request): Promise<IApiResponse<IAuthMeResponse>> {
    const user = await this.getMeUseCase.execute(req.user?.sub);
    return createSuccessResponse(user);
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto): Promise<IApiResponse<boolean>> {
    const result = await this.changePasswordUseCase.execute(req.user?.sub, dto);
    return createSuccessResponse(result);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<IApiResponse<ILoginResponse>> {
    const result = await this.loginUseCase.execute(dto);
    this.setAccessTokenCookies(result.accessToken, res);
    this.setRefreshTokenCookies(result.refreshToken, res);
    return createSuccessResponse(result.user);
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse<IRegisterResponse>> {
    const result = await this.registerUseCase.execute(dto);
    this.setAccessTokenCookies(result.accessToken, res);
    this.setRefreshTokenCookies(result.refreshToken, res);
    return createSuccessResponse(result.user);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<IApiResponse<{ success: boolean }>> {
    const result = await this.forgotPasswordUseCase.execute(dto);
    return createSuccessResponse(result);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<IApiResponse<{ success: boolean }>> {
    const result = await this.resetPasswordUseCase.execute(dto);
    return createSuccessResponse(result);
  }

  @UseGuards(AuthGuard)
  @Post('verify-phone')
  @HttpCode(HttpStatus.OK)
  async verifyPhone(@Req() req: Request, @Body() dto: VerifyPhoneDto): Promise<IApiResponse<boolean>> {
    const userId = req.user?.sub;
    const result = await this.verifyPhoneUseCase.execute(userId, dto);
    return createSuccessResponse(result);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: TAppRequest, @Res({ passthrough: true }) res: Response): Promise<IApiResponse<boolean>> {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const result = await this.logoutUseCase.execute(refreshToken);
    const cookieOptions = this.getCookieOptions();
    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);
    return createSuccessResponse(result);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: TAppRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse<boolean>> {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }
      const result = await this.refreshTokenUseCase.execute(refreshToken);
      this.setAccessTokenCookies(result.accessToken, res);
      this.setRefreshTokenCookies(result.refreshToken, res);

      return createSuccessResponse(true);
    } catch (error) {
      const cookieOptions = this.getCookieOptions();
      res.clearCookie('access_token', cookieOptions);
      res.clearCookie('refresh_token', cookieOptions);
      throw error;
    }
  }

  private getCookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production';
    const domain = this.configService.get<string>('COOKIE_DOMAIN');
    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      ...(isProduction && domain ? { domain } : {}),
      ...(isProduction ? { secure: true } : {}),
    };
  }

  private setAccessTokenCookies(accessToken: string, res: Response) {
    res.cookie('access_token', accessToken, {
      ...this.getCookieOptions(),
      maxAge: this.configService.get<number>('ACCESS_TOKEN_EXPIRES_IN', { infer: true }) * 1000,
    });
  }

  private setRefreshTokenCookies(refreshToken: string, res: Response) {
    res.cookie('refresh_token', refreshToken, {
      ...this.getCookieOptions(),
      maxAge: this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN', { infer: true }) * 1000,
    });
  }
}
