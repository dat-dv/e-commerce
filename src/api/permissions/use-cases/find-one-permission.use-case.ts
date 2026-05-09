import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IPermissionsRepository } from '../domain/permissions.repository.interface';

@Injectable()
export class FindOnePermissionUseCase {
  constructor(
    @Inject(IPermissionsRepository)
    private readonly permissionsRepository: IPermissionsRepository,
  ) {}

  async execute(id: string) {
    const permission = await this.permissionsRepository.findById(id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }
}
