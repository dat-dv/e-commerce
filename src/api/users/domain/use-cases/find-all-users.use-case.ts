import { Injectable, Inject } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(page: number, limit: number) {
    return this.usersRepository.findAll(page, limit);
  }
}
