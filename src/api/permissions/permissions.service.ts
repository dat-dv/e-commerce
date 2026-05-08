import { Injectable, BadRequestException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { handlePrismaNotFound } from '../../common/utils/prisma.util';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly prismaClient: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const existingPermission = await this.prismaClient.permission.findUnique({
      where: { permission_name: createPermissionDto.permission_name },
    });

    if (existingPermission) {
      throw new BadRequestException('Permission name already exists');
    }

    return this.prismaClient.permission.create({
      data: createPermissionDto,
    });
  }

  async findAll(page: number, limit: number) {
    return this.paginationService.paginate(this.prismaClient.permission, {}, page, limit);
  }

  async findOne(id: string) {
    const findPermission = this.prismaClient.permission.findUniqueOrThrow({
      where: { permission_id: id },
    });
    return handlePrismaNotFound(findPermission, 'Permission not found');
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    if (updatePermissionDto.permission_name) {
      const existingPermission = await this.prismaClient.permission.findUnique({
        where: { permission_name: updatePermissionDto.permission_name },
      });

      // Why: Ensure the new name isn't taken by another permission.
      if (existingPermission && existingPermission.permission_id !== id) {
        throw new BadRequestException('Permission name already exists');
      }
    }

    const updatePermission = this.prismaClient.permission.update({
      where: { permission_id: id },
      data: updatePermissionDto,
    });
    return handlePrismaNotFound(updatePermission, 'Permission not found');
  }

  async remove(id: string) {
    const rolesWithPermission = await this.prismaClient.role.count({
      where: { permissions: { some: { permission_id: id } } },
    });

    if (rolesWithPermission > 0) {
      throw new BadRequestException('Cannot delete permission because it is assigned to roles');
    }

    const deletePermission = this.prismaClient.permission.delete({
      where: { permission_id: id },
    });
    return handlePrismaNotFound(deletePermission, 'Permission not found');
  }
}
