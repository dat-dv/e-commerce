import { Injectable, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';
import { IUserProfileResponse } from '@ecommerce/shared';

@Injectable()
export class FindOneUserUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(id: string, requestingUserId: string): Promise<IUserProfileResponse> {
    const requestingUser = await this.usersRepository.findById(requestingUserId);
    if (!requestingUser) {
      throw new BadRequestException('Requesting user not found');
    }

    const permissions = await this.usersRepository.getUserPermissions(requestingUserId);

    this.checkOwnershipOrPermission(id, requestingUser.id, permissions, 'DETAIL:OWN_USER', 'DETAIL:ANY_USER');

    const user = await this.usersRepository.findById(id);
    if (!user || user.deleted_at) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  private checkOwnershipOrPermission(
    targetUserId: string,
    requestingUserId: string,
    permissions: string[],
    ownPermission: string,
    anyPermission: string,
  ) {
    const isOwner = targetUserId === requestingUserId;

    if (isOwner) {
      if (!permissions.includes(ownPermission)) {
        throw new ForbiddenException(`You do not have the '${ownPermission}' permission to action on your own profile`);
      }
    } else {
      if (!permissions.includes(anyPermission)) {
        throw new ForbiddenException(`You do not have the '${anyPermission}' permission to action on other profiles`);
      }
    }
  }
}
