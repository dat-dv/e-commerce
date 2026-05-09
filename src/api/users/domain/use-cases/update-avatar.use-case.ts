import { Injectable, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';
import { UploadImageUseCase } from 'src/api/upload/domain/use-cases/upload-image.use-case';
import { DeleteImageUseCase } from 'src/api/upload/domain/use-cases/delete-image.use-case';
import { User } from '../entities/user.entity';

@Injectable()
export class UpdateAvatarUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
    private readonly uploadImageUseCase: UploadImageUseCase,
    private readonly deleteImageUseCase: DeleteImageUseCase,
  ) {}

  async execute(id: string, requestingUserId: string, file: Express.Multer.File) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const requestingUser = await this.usersRepository.findById(requestingUserId);

    if (!requestingUser) {
      throw new BadRequestException('Requesting user not found');
    }

    this.checkOwnershipOrPermission(id, requestingUser, 'UPDATE:OWN_USER', 'UPDATE:ANY_USER');

    const image = await this.uploadImageUseCase.execute(file);

    const updatedUser = await this.usersRepository.update(id, { avatar_id: image.id });

    if (user.avatar) {
      try {
        await this.deleteImageUseCase.execute(user.avatar.publicId);
      } catch (error) {
        console.error('Failed to delete old avatar file from cloud:', error);
      }
    }

    return updatedUser;
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
