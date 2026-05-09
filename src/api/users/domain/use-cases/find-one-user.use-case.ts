import { Injectable, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class FindOneUserUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(id: string, requestingUserId: string): Promise<User> {
    const requestingUser = await this.usersRepository.findById(requestingUserId);
    if (!requestingUser) {
      throw new BadRequestException('Requesting user not found');
    }

    this.checkOwnershipOrPermission(id, requestingUser, 'DETAIL:OWN_USER', 'DETAIL:ANY_USER');

    const user = await this.usersRepository.findById(id);
    if (!user || user.deleted_at) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  private checkOwnershipOrPermission(
    targetUserId: string,
    requestingUser: User,
    ownPermission: string,
    anyPermission: string,
  ) {
    const isOwner = targetUserId === requestingUser.user_id;

    if (isOwner) {
      if (!requestingUser.permissions.includes(ownPermission)) {
        throw new ForbiddenException(`You do not have the '${ownPermission}' permission to action on your own profile`);
      }
    } else {
      if (!requestingUser.permissions.includes(anyPermission)) {
        throw new ForbiddenException(`You do not have the '${anyPermission}' permission to action on other profiles`);
      }
    }
  }
}
