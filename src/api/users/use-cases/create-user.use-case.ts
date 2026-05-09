import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IUsersRepository } from '../domain/users.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../domain/user.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    return this.usersRepository.create({
      email: dto.email,
      first_name: dto.first_name,
      last_name: dto.last_name,
      password: dto.password,
    });
  }
}
