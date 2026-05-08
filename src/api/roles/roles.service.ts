import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { handlePrismaNotFound } from '../../common/utils/prisma.util';
import { SYSTEM_ROLES } from 'src/common/constants/roles.constant';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';

@Injectable()
export class RolesService {
  constructor(
    private readonly prismaClient: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const existingRole = await this.prismaClient.role.findUnique({
      where: { role_name: createRoleDto.role_name },
    });

    if (existingRole) {
      throw new BadRequestException('Role name already exists');
    }

    return this.prismaClient.role.create({
      data: createRoleDto,
    });
  }

  async findAll(page: number, limit: number) {
    return this.paginationService.paginate(this.prismaClient.role, {}, page, limit);
  }

  async findOne(id: string) {
    const findRole = this.prismaClient.role.findUniqueOrThrow({
      where: { role_id: id },
    });
    return handlePrismaNotFound(findRole, 'Role not found');
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    if (updateRoleDto.role_name) {
      const existingRole = await this.prismaClient.role.findUnique({
        where: { role_name: updateRoleDto.role_name },
      });

      // Why: Ensure the new name isn't taken by another role to maintain uniqueness.
      if (existingRole && existingRole.role_id !== id) {
        throw new BadRequestException('Role name already exists');
      }
    }

    const updateRole = this.prismaClient.role.update({
      where: { role_id: id },
      data: updateRoleDto,
    });
    return handlePrismaNotFound(updateRole, 'Role not found');
  }

  async remove(id: string) {
    const role = await this.prismaClient.role.findUnique({
      where: { role_id: id },
    });

    if (!role) {
      throw new BadRequestException('Role not found');
    }

    // Không cho phép xóa các role hệ thống
    if (SYSTEM_ROLES.includes(role.role_name)) {
      throw new BadRequestException(`Cannot delete system roles (${SYSTEM_ROLES.join(' or ')})`);
    }

    const usersWithRole = await this.prismaClient.user.count({
      where: { role_id: id },
    });

    if (usersWithRole > 0) {
      throw new BadRequestException('Cannot delete role because it is assigned to users');
    }

    const deleteRole = this.prismaClient.role.delete({
      where: { role_id: id },
    });
    return handlePrismaNotFound(deleteRole, 'Role not found');
  }
}
