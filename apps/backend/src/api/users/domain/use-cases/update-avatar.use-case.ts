import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';
import { UploadImageUseCase } from 'src/api/upload/domain/use-cases/upload-image.use-case';

@Injectable()
export class UpdateAvatarUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
    private readonly uploadImageUseCase: UploadImageUseCase,
  ) {}

  async execute(id: string, currentUserId: string, file: Express.Multer.File) {
    if (id !== currentUserId) {
      throw new UnauthorizedException('You can only update your own avatar');
    }

    const image = await this.uploadImageUseCase.execute(file);

    const updatedUser = await this.usersRepository.updateUserProfile(id, { avatar_id: image.id });

    return updatedUser;
  }
}
