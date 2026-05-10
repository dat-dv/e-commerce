import { Controller, Post, Body, Res, Req, UnauthorizedException, Get, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import express from 'express';
import createSuccessResponse from 'src/common/respomse';
import { LoginUseCase } from './domain/use-cases/login.use-case';
import { RegisterUseCase } from './domain/use-cases/register.use-case';
import { LogoutUseCase } from './domain/use-cases/logout.use-case';
import { ForgotPasswordUseCase } from './domain/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from './domain/use-cases/reset-password.use-case';
import { RefreshTokenUseCase } from './domain/use-cases/refresh-token.use-case';
import { GetMeUseCase } from './domain/use-cases/get-me.use-case';
import { AuthGuard } from './guards/auth.guard';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/config/config.validation';

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
    private readonly configService: ConfigService<EnvVars>,
  ) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Req() req: express.Request) {
    const user = await this.getMeUseCase.execute(req.user.sub);
    return createSuccessResponse(user);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: express.Response) {
    const result = await this.loginUseCase.execute(dto);
    this.setAccessTokenCookies(result.accessToken, res);
    this.setRefreshTokenCookies(result.refreshToken, res);
    return createSuccessResponse(result.user);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: express.Response) {
    const result = await this.registerUseCase.execute(dto);
    this.setAccessTokenCookies(result.accessToken, res);
    this.setRefreshTokenCookies(result.refreshToken, res);
    return createSuccessResponse(result.user);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const result = await this.forgotPasswordUseCase.execute(dto);
    return createSuccessResponse(result);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const result = await this.resetPasswordUseCase.execute(dto);
    return createSuccessResponse(result);
  }

  @Post('logout')
  async logout(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response) {
    const refreshToken = req.cookies['refresh_token'] as string | undefined;
    const result = await this.logoutUseCase.execute(refreshToken);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return createSuccessResponse(result);
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response) {
    const accessToken = req.cookies['access_token'] as string | undefined;
    const refreshToken = req.cookies['refresh_token'] as string | undefined;

    const result = await this.refreshTokenUseCase.execute(accessToken, refreshToken);

    this.setAccessTokenCookies(result.accessToken, res);
    this.setRefreshTokenCookies(result.refreshToken, res);

    return createSuccessResponse(true);
  }

  private setAccessTokenCookies(accessToken: string, res: express.Response) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.configService.get<number>('ACCESS_TOKEN_EXPIRES_IN', { infer: true }) * 1000,
    });
  }

  private setRefreshTokenCookies(refreshToken: string, res: express.Response) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN', { infer: true }) * 1000,
    });
  }
}
