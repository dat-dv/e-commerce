import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import express from 'express';
import createSuccessResponse from 'src/common/respomse';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: express.Response) {
    const result = await this.authService.login(dto, res);
    return createSuccessResponse(result);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: express.Response) {
    const result = await this.authService.register(dto, res);
    return createSuccessResponse(result);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(dto);
    return createSuccessResponse(result);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(dto);
    return createSuccessResponse(result);
  }

  @Post('logout')
  async logout(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response) {
    const result = await this.authService.logout(req, res);
    return createSuccessResponse(result);
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Express.Request, @Res({ passthrough: true }) res: Express.Response) {
    const result = await this.authService.refreshToken(req, res);
    return createSuccessResponse(result);
  }
}
