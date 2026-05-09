import { Injectable } from '@nestjs/common';
import { IRolesRepository, PaginatedResult } from '../domain/roles.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class RolesRepository implements IRolesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: Prisma.RoleCreateInput): Promise<Prisma.RoleGetPayload<Record<string, never>>> {
    return this.prisma.role.create({
      data,
    });
  }

  async findAll(page: number, limit: number): Promise<PaginatedResult<Prisma.RoleGetPayload<Record<string, never>>>> {
    return this.paginationService.paginate<Prisma.RoleGetPayload<Record<string, never>>>(
      this.prisma.role,
      {},
      page,
      limit,
    );
  }

  async findById(id: string): Promise<Prisma.RoleGetPayload<Record<string, never>> | null> {
    return this.prisma.role.findUnique({
      where: { role_id: id },
    });
  }

  async findByName(name: string): Promise<Prisma.RoleGetPayload<Record<string, never>> | null> {
    return this.prisma.role.findUnique({
      where: { role_name: name },
    });
  }

  async update(id: string, data: Prisma.RoleUpdateInput): Promise<Prisma.RoleGetPayload<Record<string, never>>> {
    return this.prisma.role.update({
      where: { role_id: id },
      data,
    });
  }

  async delete(id: string): Promise<Prisma.RoleGetPayload<Record<string, never>>> {
    return this.prisma.role.delete({
      where: { role_id: id },
    });
  }

  async countUsersWithRole(roleId: string): Promise<number> {
    return this.prisma.user.count({
      where: { role_id: roleId },
    });
  }
}
