import { Injectable, Inject } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';
import { IUserProfileResponse } from '@ecommerce/shared';
import { UpdateUserDto } from '../../dto/update-user.dto';
@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(id: string, data: UpdateUserDto): Promise<IUserProfileResponse> {
    const user = await this.usersRepository.updateUserProfile(id, data);
    const { password, ...userResponse } = user;
    return userResponse;
  }
}
