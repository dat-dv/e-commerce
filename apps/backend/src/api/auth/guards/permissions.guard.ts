import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PERMISSIONS_KEY } from 'src/common/decorators/permissions.decorator';
import { ICacheService } from 'src/shared/services/cache/cache.interface';
import { CacheKeys } from 'src/shared/services/cache/cache-keys';
import { Request } from 'express';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    @Inject(ICacheService) private readonly cacheService: ICacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    if (!user?.sub) return false;

    const cacheKey = CacheKeys.userPermissions(user.sub);
    const cached = await this.cacheService.get(cacheKey).catch(() => null);
    let userPermissions = cached ? (JSON.parse(cached) as string[]) : null;

    if (!userPermissions) {
      const dbUser = await this.prisma.user.findUnique({
        where: { id: user.sub },
        select: {
          role: {
            select: {
              permissions: { select: { permission: { select: { permission_name: true } } } },
            },
          },
        },
      });
      if (!dbUser?.role) return false;

      userPermissions = dbUser.role.permissions.map((p) => p.permission.permission_name);
      await this.cacheService.set(cacheKey, JSON.stringify(userPermissions), 3600).catch(() => {});
    }

    return requiredPermissions.every((permission) => userPermissions.includes(permission));
  }
}
