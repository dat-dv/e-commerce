import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PERMISSIONS_KEY } from 'src/common/decorators/permissions.decorator';
import { Request } from 'express';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user || !user.sub) {
      return false;
    }

    // should use sth to cache roles and permissions
    const dbUser = await this.prisma.user.findUnique({
      where: { user_id: user.sub },
      select: {
        role: {
          select: {
            permissions: {
              select: {
                permission_name: true,
              },
            },
          },
        },
      },
    });
    if (!dbUser || !dbUser.role) {
      return false;
    }

    const userPermissions = dbUser.role.permissions.map((p) => p.permission_name);
    return requiredPermissions.every((permission) => userPermissions.includes(permission));
  }
}
