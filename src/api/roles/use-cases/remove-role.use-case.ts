import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IRolesRepository } from '../domain/roles.repository.interface';
import { SYSTEM_ROLES } from 'src/common/constants/roles.constant';

@Injectable()
export class RemoveRoleUseCase {
  constructor(
    @Inject(IRolesRepository)
    private readonly rolesRepository: IRolesRepository,
  ) {}

  async execute(id: string) {
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      throw new BadRequestException('Role not found');
    }

    // Không cho phép xóa các role hệ thống
    if (SYSTEM_ROLES.includes(role.role_name)) {
      throw new BadRequestException(`Cannot delete system roles (${SYSTEM_ROLES.join(' or ')})`);
    }

    const usersWithRole = await this.rolesRepository.countUsersWithRole(id);

    if (usersWithRole > 0) {
      throw new BadRequestException('Cannot delete role because it is assigned to users');
    }

    return this.rolesRepository.delete(id);
  }
}
