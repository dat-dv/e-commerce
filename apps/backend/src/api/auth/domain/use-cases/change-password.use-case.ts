import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IUsersRepository } from 'src/api/users/domain/entities/users.repository.interface';
import { ChangePasswordDto } from '../../dto/change-password.dto';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(userId: string, dto: ChangePasswordDto): Promise<boolean> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.password !== dto.old_password) {
      throw new BadRequestException('Current password does not match');
    }

    await this.usersRepository.updatePassword(user.id, dto.new_password);

    return true;
  }
}
