import { Injectable, Inject } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(id: string, data: any) {
    return this.usersRepository.updateUserProfile(id, data);
  }
}
