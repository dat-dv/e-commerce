import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';
import { IUser } from '../entities/user.entity';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async findById(id: string): Promise<IUser | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
      include: {
        avatar: true,
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    console.log(999, prismaUser);

    if (!prismaUser) return null;

    return prismaUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
      include: {
        avatar: true,
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!prismaUser) return null;

    return prismaUser;
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser> {
    const prismaUser = await this.prisma.user.update({
      where: { id },
      data: data,
      include: {
        avatar: true,
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    return prismaUser;
  }

  async create(data: { email: string; first_name: string; last_name: string; password?: string }): Promise<IUser> {
    const prismaUser = await this.prisma.user.create({
      data: data as Prisma.UserCreateInput,
      include: {
        avatar: true,
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    return prismaUser;
  }

  async findAll(page: number, limit: number) {
    const result = await this.paginationService.paginate<IUser>(
      this.prisma.user,
      {
        where: { deleted_at: null },
        include: {
          avatar: true,
          role: {
            include: {
              permissions: true,
            },
          },
        },
      },
      page,
      limit,
    );

    return result;
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    return user?.role?.permissions.map((p) => p.permission_name) || [];
  }

  async getUserAvatarPublicId(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        avatar: true,
      },
    });

    return user?.avatar?.publicId || null;
  }
}
