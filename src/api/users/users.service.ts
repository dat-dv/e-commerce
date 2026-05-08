import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Prisma } from 'generated/prisma/browser';
import { handlePrismaNotFound } from '../../common/utils/prisma.util';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}
  async create(dto: CreateUserDto) {
    if (dto.password !== dto.confirm_password) {
      throw new UnauthorizedException('Passwords do not match');
    }

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
      throw new ConflictException('User already exists');
    }

    throw new BadRequestException('User is soft deleted, please contact admin to restore');
  }

  async findAll(page: number, limit: number) {
    return this.paginationService.paginate(this.prisma.user, { where: { deleted_at: null } }, page, limit);
  }

  async findOne(id: string) {
    return handlePrismaNotFound(
      this.prisma.user.findUniqueOrThrow({ where: { user_id: id, deleted_at: null } }),
      'User not found',
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return handlePrismaNotFound(
      this.prisma.user.update({
        where: { user_id: id, deleted_at: null },
        data: updateUserDto,
      }),
      'User not found',
    );
  }

  async remove(id: string) {
    return handlePrismaNotFound(
      this.prisma.user.update({
        where: { user_id: id, deleted_at: null },
        data: { deleted_at: new Date() },
      }),
      'User not found',
    );
  }

  async findOneByEmail(email: string, isDeleted: boolean = false) {
    const where: Prisma.UserWhereUniqueInput = { email };
    if (!isDeleted) {
      where.deleted_at = null;
    }
    return await this.prisma.user.findUnique({ where });
  }
}
