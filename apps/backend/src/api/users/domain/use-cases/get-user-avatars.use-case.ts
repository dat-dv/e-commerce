import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IUserAvatarResponse } from '@ecommerce/shared';
import { IUsersRepository } from '../entities/users.repository.interface';

@Injectable()
export class GetUserAvatarsUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(id: string, currentUserId: string): Promise<IUserAvatarResponse[]> {
    if (id !== currentUserId) {
      throw new UnauthorizedException('You can only get your own avatars');
    }

    const avatars = await this.usersRepository.findUserAvatars(id);
    if (!avatars) {
      throw new NotFoundException('User not found');
    }

    return avatars;
  }
}
