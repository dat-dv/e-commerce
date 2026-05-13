import { Injectable } from '@nestjs/common';
import { IRolesRepository } from '../entities/roles.repository.interface';
import { IRole } from '@ecommerce/shared';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class RolesRepository implements IRolesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: Prisma.RoleCreateInput): Promise<IRole> {
    return this.prisma.role.create({
      data,
    });
  }

  async findAll(page: number, limit: number): Promise<PaginatedResult<IRole>> {
    return this.paginationService.paginate<IRole>(this.prisma.role, {}, page, limit);
  }

  async findById(id: string): Promise<IRole | null> {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<IRole | null> {
    return this.prisma.role.findUnique({
      where: { role_name: name },
    });
  }

  async update(id: string, data: Prisma.RoleUpdateInput): Promise<IRole> {
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<IRole> {
    return this.prisma.role.delete({
      where: { id },
    });
  }

  async countUsersWithRole(roleId: string): Promise<number> {
    return this.prisma.user.count({
      where: { role_id: roleId },
    });
  }
}
