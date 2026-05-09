import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { IPermissionsRepository } from '../domain/permissions.repository.interface';
import { UpdatePermissionDto } from '../dto/update-permission.dto';

@Injectable()
export class UpdatePermissionUseCase {
  constructor(
    @Inject(IPermissionsRepository)
    private readonly permissionsRepository: IPermissionsRepository,
  ) {}

  async execute(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionsRepository.findById(id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    if (updatePermissionDto.permission_name) {
      const existingPermission = await this.permissionsRepository.findByName(updatePermissionDto.permission_name);

      if (existingPermission && existingPermission.permission_id !== id) {
        throw new BadRequestException('Permission name already exists');
      }
    }

    return this.permissionsRepository.update(id, updatePermissionDto);
  }
}
