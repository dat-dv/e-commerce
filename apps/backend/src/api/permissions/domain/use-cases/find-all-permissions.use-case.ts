import { Injectable, Inject } from '@nestjs/common';
import { IPermissionsRepository } from '../entities/permissions.repository.interface';

@Injectable()
export class FindAllPermissionsUseCase {
  constructor(
    @Inject(IPermissionsRepository)
    private readonly permissionsRepository: IPermissionsRepository,
  ) {}

  async execute(page: number, limit: number) {
    return this.permissionsRepository.findAll(page, limit);
  }
}
