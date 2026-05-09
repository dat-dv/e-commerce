import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { IPermissionsRepository } from '../entities/permissions.repository.interface';

@Injectable()
export class RemovePermissionUseCase {
  constructor(
    @Inject(IPermissionsRepository)
    private readonly permissionsRepository: IPermissionsRepository,
  ) {}

  async execute(id: string) {
    const permission = await this.permissionsRepository.findById(id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const rolesWithPermission = await this.permissionsRepository.countRolesWithPermission(id);

    if (rolesWithPermission > 0) {
      throw new BadRequestException('Cannot delete permission because it is assigned to roles');
    }

    return this.permissionsRepository.delete(id);
  }
}
