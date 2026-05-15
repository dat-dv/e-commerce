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
    const result = await this.usersRepository.findAll(page, limit);
    return {
      ...result,
      items: result.items.map(({ password, salt, ...user }) => user),
    };
  }
}
