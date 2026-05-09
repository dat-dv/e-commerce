import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';
import { IUser } from '../entities/user.entity';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { Prisma } from 'generated/prisma/client';

type PrismaUserWithRelations = Prisma.UserGetPayload<{
  include: {
    avatar: true;
    role: {
      include: {
        permissions: true;
      };
    };
  };
}>;

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async findById(id: string): Promise<IUser | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { user_id: id },
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

    return this.mapToEntity(prismaUser);
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

    return this.mapToEntity(prismaUser);
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser> {
    const prismaUser = await this.prisma.user.update({
      where: { user_id: id },
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

    return this.mapToEntity(prismaUser);
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

    return this.mapToEntity(prismaUser);
  }

  async findAll(page: number, limit: number): Promise<{ data: IUser[]; meta: any }> {
    const result = await this.paginationService.paginate(
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

    return {
      data: result.items.map((u: unknown) => this.mapToEntity(u as PrismaUserWithRelations)),
      meta: result.meta,
    };
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
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
      where: { user_id: userId },
      include: {
        avatar: true,
      },
    });

    return user?.avatar?.publicId || null;
  }

  private mapToEntity(prismaUser: PrismaUserWithRelations): IUser {
    return {
      user_id: prismaUser.user_id,
      first_name: prismaUser.first_name,
      last_name: prismaUser.last_name,
      email: prismaUser.email,
      avatar_id: prismaUser.avatar_id,
      password: prismaUser.password,
      created_at: prismaUser.created_at,
      updated_at: prismaUser.updated_at,
      deleted_at: prismaUser.deleted_at,
      role_id: prismaUser.role_id,
    };
  }
}
