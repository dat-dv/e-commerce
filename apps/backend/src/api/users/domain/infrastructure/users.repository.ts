import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';
import { IUser, Gender } from '../entities/user.entity';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { ROLE_USER } from 'src/common/constants/roles.constant';

interface UserWithAvatar {
  avatar: {
    public_id: string | null;
  } | null;
}

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async findById(id: string): Promise<IUser | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!prismaUser) return null;

    return {
      id: prismaUser.id,
      first_name: prismaUser.first_name,
      last_name: prismaUser.last_name,
      email: prismaUser.email,
      date_of_birth: prismaUser.date_of_birth,
      gender: prismaUser.gender,
      avatar_id: prismaUser.avatar_id,
      password: prismaUser.password,
      created_at: prismaUser.created_at,
      updated_at: prismaUser.updated_at,
      deleted_at: prismaUser.deleted_at,
      role_id: prismaUser.role_id,
      role_name: prismaUser.role?.role_name ?? null,
    };
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!prismaUser) return null;

    return {
      id: prismaUser.id,
      first_name: prismaUser.first_name,
      last_name: prismaUser.last_name,
      email: prismaUser.email,
      date_of_birth: prismaUser.date_of_birth,
      gender: prismaUser.gender,
      avatar_id: prismaUser.avatar_id,
      password: prismaUser.password,
      created_at: prismaUser.created_at,
      updated_at: prismaUser.updated_at,
      deleted_at: prismaUser.deleted_at,
      role_id: prismaUser.role_id,
      role_name: prismaUser.role?.role_name ?? null,
    };
  }

  async update(id: string, data: Partial<Omit<IUser, 'addresses' | 'phones'>>): Promise<IUser> {
    const prismaUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    return {
      id: prismaUser.id,
      first_name: prismaUser.first_name,
      last_name: prismaUser.last_name,
      email: prismaUser.email,
      date_of_birth: prismaUser.date_of_birth,
      gender: prismaUser.gender,
      avatar_id: prismaUser.avatar_id,
      password: prismaUser.password,
      created_at: prismaUser.created_at,
      updated_at: prismaUser.updated_at,
      deleted_at: prismaUser.deleted_at,
      role_id: prismaUser.role_id,
    };
  }

  async create(data: { email: string; first_name: string; last_name: string; password: string }): Promise<IUser> {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        role: {
          connect: { role_name: ROLE_USER },
        },
      },
    });

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      date_of_birth: user.date_of_birth,
      gender: user.gender,
      avatar_id: user.avatar_id,
      password: user.password,
      created_at: user.created_at,
      updated_at: user.updated_at,
      deleted_at: user.deleted_at,
      role_id: user.role_id,
    };
  }

  async findAll(page: number, limit: number) {
    const result = await this.paginationService.paginate<IUser>(
      this.prisma.user,
      {
        where: { deleted_at: null },
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

  async addUserPhone(
    userId: string,
    data: { phone: string; phone_code: string; is_verified: boolean; is_default: boolean },
  ): Promise<boolean> {
    await this.prisma.userPhone.create({
      data: {
        user_id: userId,
        phone: data.phone,
        phone_code: data.phone_code,
        is_default: data.is_default,
        is_verified: data.is_verified,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return true;
  }
}
