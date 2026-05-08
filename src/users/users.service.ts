import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        password: dto.password,
        email: dto.email,
        first_name: dto.first_name,
        last_name: dto.last_name,
      },
    });
    return user;
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({ where: { user_id: id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({ where: { user_id: id }, data: updateUserDto });
  }

  async remove(id: string) {
    return await this.prisma.user.update({
      where: { user_id: id },
      data: { deleted_at: new Date() },
    });
  }
}
