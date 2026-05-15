import { Injectable, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';
import { UploadImageUseCase } from 'src/api/upload/domain/use-cases/upload-image.use-case';
import { DeleteImageUseCase } from 'src/api/upload/domain/use-cases/delete-image.use-case';

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

    const permissions = await this.usersRepository.getUserPermissions(requestingUserId);

    this.checkOwnershipOrPermission(id, requestingUser.id, permissions, 'UPDATE:OWN_USER', 'UPDATE:ANY_USER');

    const oldAvatarPublicId = await this.usersRepository.getUserAvatarPublicId(id);

    const image = await this.uploadImageUseCase.execute(file);

    const updatedUser = await this.usersRepository.updateUserProfile(id, { avatar_id: image.id });

    if (oldAvatarPublicId) {
      try {
        await this.deleteImageUseCase.execute(oldAvatarPublicId);
      } catch (error) {
        console.error('Failed to delete old avatar file from cloud:', error);
      }
    }

    return updatedUser;
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
