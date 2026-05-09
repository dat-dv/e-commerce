import { Injectable, Inject } from '@nestjs/common';
import { IRolesRepository } from '../domain/roles.repository.interface';

@Injectable()
export class FindAllRolesUseCase {
  constructor(
    @Inject(IRolesRepository)
    private readonly rolesRepository: IRolesRepository,
  ) {}

  async execute(page: number, limit: number) {
    return this.rolesRepository.findAll(page, limit);
  }
}
