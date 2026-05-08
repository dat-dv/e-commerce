import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { EnvVars } from 'src/config/config.validation';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvVars>,
  ) {}
  /**
   * Determines if the request is allowed to proceed.
   * Checks for access_token in cookies and verifies it.
   * @param context Execution context
   * @returns boolean indicating if access is allowed
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Express.Request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['access_token'];

    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }
    try {
      const payload = await this.authService.checkJWTTokenIsExpired(token);
      // Attach user info to request object for use in controllers
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    return true;
  }
}
