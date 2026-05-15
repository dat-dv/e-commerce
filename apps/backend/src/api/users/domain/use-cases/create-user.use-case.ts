import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';
import { CreateUserDto } from '../../dto/create-user.dto';
import { IUserProfileResponse } from '@ecommerce/shared';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<IUserProfileResponse> {
    const existingUser = await this.usersRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const user = await this.usersRepository.create({
      email: dto.email,
      password: dto.password,
    });

    const { password, salt, ...userResponse } = user;
    return userResponse;
  }
}
