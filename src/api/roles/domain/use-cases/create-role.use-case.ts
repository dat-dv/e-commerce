import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IRolesRepository } from '../entities/roles.repository.interface';
import { CreateRoleDto } from '../../dto/create-role.dto';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(IRolesRepository)
    private readonly rolesRepository: IRolesRepository,
  ) {}

  async execute(createRoleDto: CreateRoleDto) {
    const existingRole = await this.rolesRepository.findByName(createRoleDto.role_name);

    if (existingRole) {
      throw new BadRequestException('Role name already exists');
    }

    return this.rolesRepository.create(createRoleDto);
  }
}
