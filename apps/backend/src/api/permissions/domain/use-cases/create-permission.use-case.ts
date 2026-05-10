import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IPermissionsRepository } from '../entities/permissions.repository.interface';
import { CreatePermissionDto } from '../../dto/create-permission.dto';

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @Inject(IPermissionsRepository)
    private readonly permissionsRepository: IPermissionsRepository,
  ) {}

  async execute(createPermissionDto: CreatePermissionDto) {
    const existingPermission = await this.permissionsRepository.findByName(createPermissionDto.permission_name);

    if (existingPermission) {
      throw new BadRequestException('Permission name already exists');
    }

    return this.permissionsRepository.create(createPermissionDto);
  }
}
