import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IRolesRepository } from '../entities/roles.repository.interface';
import { UpdateRoleDto } from '../../dto/update-role.dto';

@Injectable()
export class UpdateRoleUseCase {
  constructor(
    @Inject(IRolesRepository)
    private readonly rolesRepository: IRolesRepository,
  ) {}

  async execute(id: string, updateRoleDto: UpdateRoleDto) {
    if (updateRoleDto.role_name) {
      const existingRole = await this.rolesRepository.findByName(updateRoleDto.role_name);

      if (existingRole && existingRole.id !== id) {
        throw new BadRequestException('Role name already exists');
      }
    }

    const role = await this.rolesRepository.findById(id);
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    return this.rolesRepository.update(id, updateRoleDto);
  }
}
