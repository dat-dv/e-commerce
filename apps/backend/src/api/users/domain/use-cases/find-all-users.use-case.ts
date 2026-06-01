import { Injectable, Inject } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';
import { IGetUsersResponse } from '@ecommerce/shared';

import { GetUsersDto } from '../../dto/get-users.dto';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(query: GetUsersDto): Promise<IGetUsersResponse> {
    const result = await this.usersRepository.findAll(query);
    return {
      ...result,
      items: result.items.map(({ password, ...user }) => user),
    };
  }
}
