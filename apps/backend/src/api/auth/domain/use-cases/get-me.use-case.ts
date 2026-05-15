import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IUsersRepository } from 'src/api/users/domain/entities/users.repository.interface';
import { IAuthMeResponse } from '@ecommerce/shared';

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(userId: string): Promise<IAuthMeResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user || user.deleted_at) {
      throw new BadRequestException('User not found');
    }
    // Logic remains identical, but now 'user' is typed as IUserResponse
    const { password, salt, ...userResponse } = user;
    return userResponse;
  }
}
