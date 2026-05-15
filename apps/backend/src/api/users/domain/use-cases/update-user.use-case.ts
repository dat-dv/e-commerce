import { Injectable, Inject } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';
import { IUpdateUserRequest, IUserProfileResponse } from '@ecommerce/shared';
@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(id: string, data: IUpdateUserRequest): Promise<IUserProfileResponse> {
    const user = await this.usersRepository.updateUserProfile(id, data);
    const { password, salt, ...userResponse } = user;
    return userResponse;
  }
}
