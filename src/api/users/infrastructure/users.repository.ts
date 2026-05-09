import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../domain/users.repository.interface';
import { User } from '../domain/user.entity';
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

  async findById(id: string): Promise<User | null> {
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

  async findByEmail(email: string): Promise<User | null> {
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

  async update(id: string, data: Partial<User>): Promise<User> {
    const { avatar, permissions, ...updateData } = data;

    const prismaUser = await this.prisma.user.update({
      where: { user_id: id },
      data: updateData,
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

  async create(data: { email: string; first_name: string; last_name: string; password?: string }): Promise<User> {
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

  async findAll(page: number, limit: number): Promise<{ data: User[]; meta: any }> {
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

  private mapToEntity(prismaUser: PrismaUserWithRelations): User {
    const permissions = prismaUser.role?.permissions.map((p) => p.permission_name) || [];

    return new User(
      prismaUser.user_id,
      prismaUser.first_name,
      prismaUser.last_name,
      prismaUser.email,
      prismaUser.avatar_id,
      prismaUser.password,
      prismaUser.created_at,
      prismaUser.updated_at,
      prismaUser.deleted_at,
      prismaUser.avatar
        ? {
            id: prismaUser.avatar.id,
            publicId: prismaUser.avatar.publicId,
            url: prismaUser.avatar.url,
          }
        : null,
      permissions,
    );
  }
}
