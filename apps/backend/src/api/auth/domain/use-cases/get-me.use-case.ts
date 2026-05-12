import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IUsersRepository } from 'src/api/users/domain/entities/users.repository.interface';
import { IUser } from 'src/api/users/domain/entities/user.entity';

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(userId: string): Promise<IUser> {
    const user = await this.usersRepository.findById(userId);
    if (!user || user.deleted_at) {
      throw new BadRequestException('User not found');
    }
    const { password, salt, ...userResponse } = user;
    return userResponse;
  }
}
