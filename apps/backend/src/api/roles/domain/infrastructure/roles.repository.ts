import { Injectable } from '@nestjs/common';
import { IRolesRepository } from '../entities/roles.repository.interface';
import { Role, IPaginatedResult } from '@ecommerce/shared';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class RolesRepository implements IRolesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: Prisma.RoleCreateInput): Promise<Role> {
    return this.prisma.role.create({
      data,
    });
  }

  async findAll(page: number, limit: number): Promise<IPaginatedResult<Role>> {
    const result = await this.paginationService.paginate(this.prisma.role, {}, page, limit);
    return result;
  }

  async findById(id: string): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { role_name: name },
    });
  }

  async update(id: string, data: Prisma.RoleUpdateInput): Promise<Role> {
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Role> {
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
