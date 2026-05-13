import { Injectable } from '@nestjs/common';
import { IPermissionsRepository } from '../entities/permissions.repository.interface';
import { IPermission } from '@ecommerce/shared';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PermissionsRepository implements IPermissionsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: Prisma.PermissionCreateInput): Promise<IPermission> {
    return this.prisma.permission.create({
      data,
    });
  }

  async findAll(page: number, limit: number): Promise<PaginatedResult<IPermission>> {
    return this.paginationService.paginate<IPermission>(this.prisma.permission, {}, page, limit);
  }

  async findById(id: string): Promise<IPermission | null> {
    return this.prisma.permission.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<IPermission | null> {
    return this.prisma.permission.findUnique({
      where: { permission_name: name },
    });
  }

  async update(id: string, data: Prisma.PermissionUpdateInput): Promise<IPermission> {
    return this.prisma.permission.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<IPermission> {
    return this.prisma.permission.delete({
      where: { id },
    });
  }

  async countRolesWithPermission(permissionId: string): Promise<number> {
    return this.prisma.role.count({
      where: { permissions: { some: { id: permissionId } } },
    });
  }
}
