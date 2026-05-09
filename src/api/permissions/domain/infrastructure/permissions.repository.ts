import { Injectable } from '@nestjs/common';
import { IPermissionsRepository } from '../entities/permissions.repository.interface';
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

  async create(data: Prisma.PermissionCreateInput): Promise<Prisma.PermissionGetPayload<Record<string, never>>> {
    return this.prisma.permission.create({
      data,
    });
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Prisma.PermissionGetPayload<Record<string, never>>>> {
    return this.paginationService.paginate<Prisma.PermissionGetPayload<Record<string, never>>>(
      this.prisma.permission,
      {},
      page,
      limit,
    );
  }

  async findById(id: string): Promise<Prisma.PermissionGetPayload<Record<string, never>> | null> {
    return this.prisma.permission.findUnique({
      where: { permission_id: id },
    });
  }

  async findByName(name: string): Promise<Prisma.PermissionGetPayload<Record<string, never>> | null> {
    return this.prisma.permission.findUnique({
      where: { permission_name: name },
    });
  }

  async update(
    id: string,
    data: Prisma.PermissionUpdateInput,
  ): Promise<Prisma.PermissionGetPayload<Record<string, never>>> {
    return this.prisma.permission.update({
      where: { permission_id: id },
      data,
    });
  }

  async delete(id: string): Promise<Prisma.PermissionGetPayload<Record<string, never>>> {
    return this.prisma.permission.delete({
      where: { permission_id: id },
    });
  }

  async countRolesWithPermission(permissionId: string): Promise<number> {
    return this.prisma.role.count({
      where: { permissions: { some: { permission_id: permissionId } } },
    });
  }
}
