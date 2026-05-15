import { Injectable, Inject } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';
import { IGetUsersResponse } from '@ecommerce/shared';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(page: number, limit: number): Promise<IGetUsersResponse> {
    return this.usersRepository.findAll(page, limit);
  }
}
