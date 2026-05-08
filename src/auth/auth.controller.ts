import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
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

  @Post('logout')
  async logout(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response) {
    const result = await this.authService.logout(req, res);
    return createSuccessResponse(result);
  }
}
