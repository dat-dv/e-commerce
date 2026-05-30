import { Injectable } from '@nestjs/common';
import { IRolesRepository } from '../entities/roles.repository.interface';
import { IRoleResponse, IPaginatedResult, ICreateRoleRequest, IUpdateRoleRequest } from '@ecommerce/shared';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';

@Injectable()
export class RolesRepository implements IRolesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  private readonly ROLE_INCLUDE = {
    permissions: {
      include: {
        permission: true,
      },
    },
  };

  async create(data: ICreateRoleRequest): Promise<IRoleResponse> {
    return this.prisma.role.create({
      data: {
        role_name: data.role_name,
        description: data.description,
        permissions: {
          create: data.permissions?.map((permission) => ({
            permission: { connect: { id: permission } },
          })),
        },
      },
      include: this.ROLE_INCLUDE,
    });
  }

  async findAll(page: number, limit: number): Promise<IPaginatedResult<IRoleResponse>> {
    const result = await this.paginationService.paginate(this.prisma.role, { include: this.ROLE_INCLUDE }, page, limit);
    return result;
  }

  async findById(id: string): Promise<IRoleResponse | null> {
    return this.prisma.role.findUnique({
      where: { id },
      include: this.ROLE_INCLUDE,
    });
  }

  async findByName(name: string): Promise<IRoleResponse | null> {
    return this.prisma.role.findUnique({
      where: { role_name: name },
      include: this.ROLE_INCLUDE,
    });
  }

  async update(id: string, data: IUpdateRoleRequest): Promise<IRoleResponse> {
    return this.prisma.role.update({
      where: { id },
      data: {
        role_name: data.role_name,
        description: data.description,
        ...(data.permissions && {
          permissions: {
            deleteMany: {},
            create: data.permissions.map((permission) => ({
              permission: { connect: { id: permission } },
            })),
          },
        }),
      },
      include: this.ROLE_INCLUDE,
    });
  }

  async delete(id: string): Promise<IRoleResponse> {
    return this.prisma.role.delete({
      where: { id },
      include: this.ROLE_INCLUDE,
    });
  }

  async countUsersWithRole(roleId: string): Promise<number> {
    return this.prisma.user.count({
      where: { role_id: roleId },
    });
  }
}
