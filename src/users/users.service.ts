import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Prisma } from 'generated/prisma/browser';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateUserDto) {
    const existingUser = await this.findOneByEmail(dto.email, true);
    const isNewUser = !existingUser;

    if (isNewUser) {
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

    const isExistedUser = existingUser?.deleted_at === null;
    if (isExistedUser) {
      throw new Error('User already exists');
    }

    throw new Error('User is soft deleted, please contact admin to restore');
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({ where: { user_id: id, deleted_at: null } });
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

  async findOneByEmail(email: string, isDeleted: boolean = false) {
    const where: Prisma.UserWhereUniqueInput = { email };
    if (!isDeleted) {
      where.deleted_at = null;
    }
    return await this.prisma.user.findUnique({ where });
  }
}
