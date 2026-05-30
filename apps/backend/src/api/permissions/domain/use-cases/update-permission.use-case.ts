import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { IPermissionsRepository } from '../entities/permissions.repository.interface';
import { UpdatePermissionDto } from '../../dto/update-permission.dto';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { ICacheService } from 'src/shared/services/cache/cache.interface';
import { CacheKeys } from 'src/shared/services/cache/cache-keys';

@Injectable()
export class UpdatePermissionUseCase {
  constructor(
    @Inject(IPermissionsRepository)
    private readonly permissionsRepository: IPermissionsRepository,
    private readonly prisma: PrismaService,
    @Inject(ICacheService) private readonly cacheService: ICacheService,
  ) {}

  async execute(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionsRepository.findById(id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    if (updatePermissionDto.permission_name) {
      const existingPermission = await this.permissionsRepository.findByName(updatePermissionDto.permission_name);

      if (existingPermission && existingPermission.id !== id) {
        throw new BadRequestException('Permission name already exists');
      }
    }

    const result = await this.permissionsRepository.update(id, updatePermissionDto);

    // Xóa cache permissions của tất cả user có role chứa permission này
    const affectedUsers = await this.prisma.user.findMany({
      where: { role: { permissions: { some: { permission_id: id } } } },
      select: { id: true },
    });
    await Promise.all(
      affectedUsers.map((u) => this.cacheService.delete(CacheKeys.userPermissions(u.id)).catch(() => {})),
    );

    return result;
  }
}
