import { Injectable, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { IUser } from '../entities/user.entity';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(id: string, requestingUserId: string, dto: UpdateUserDto): Promise<IUser> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const requestingUser = await this.usersRepository.findById(requestingUserId);
    if (!requestingUser) {
      throw new BadRequestException('Requesting user not found');
    }

    const permissions = await this.usersRepository.getUserPermissions(requestingUserId);

    this.checkOwnershipOrPermission(id, requestingUser.user_id, permissions, 'UPDATE:OWN_USER', 'UPDATE:ANY_USER');

    return this.usersRepository.update(id, dto);
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
