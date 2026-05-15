import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';
import { CreateUserDto } from '../../dto/create-user.dto';
import { IUser } from '@ecommerce/shared';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<IUser> {
    const existingUser = await this.usersRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    return this.usersRepository.create({
      email: dto.email,
      password: dto.password,
    });
  }
}
