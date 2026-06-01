import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IUsersRepository } from 'src/api/users/domain/entities/users.repository.interface';
import { verifyPassword } from 'src/common/utils/password.util';
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

    if (!verifyPassword(dto.old_password, user.password)) {
      throw new BadRequestException('Current password does not match');
    }

    await this.usersRepository.updatePassword(user.id, dto.new_password);

    return true;
  }
}
