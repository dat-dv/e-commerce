import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';

@Injectable()
export class RemoveUserUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    const user = await this.usersRepository.findById(id);
    if (!user || user.deleted_at) {
      throw new BadRequestException('User not found');
    }

    await this.usersRepository.remove(id);

    return true;
  }
}
