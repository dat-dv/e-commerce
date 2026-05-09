import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IRolesRepository } from '../domain/roles.repository.interface';

@Injectable()
export class FindOneRoleUseCase {
  constructor(
    @Inject(IRolesRepository)
    private readonly rolesRepository: IRolesRepository,
  ) {}

  async execute(id: string) {
    const role = await this.rolesRepository.findById(id);
    if (!role) {
      throw new BadRequestException('Role not found');
    }
    return role;
  }
}
