import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TAccessTokenPayload } from '../auth.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Express.Request = context.switchToHttp().getRequest<Request>();

    if (request['user']) {
      return true;
    }

    const token = request.cookies['access_token'];

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<TAccessTokenPayload>(token, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    return true;
  }
}
