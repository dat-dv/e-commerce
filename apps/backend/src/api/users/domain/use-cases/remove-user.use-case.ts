import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';

@Injectable()
export class RemoveUserUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user || user.deleted_at) {
      throw new BadRequestException('User not found');
    }

    return this.usersRepository.updateUserProfile(id, { deleted_at: new Date() });
  }
}
