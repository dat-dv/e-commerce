import { BadRequestException, Injectable } from '@nestjs/common';
import { IUsersRepository } from '../entities/users.repository.interface';
import { IUser } from '@ecommerce/shared';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import * as crypto from 'crypto';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { ROLE_USER } from 'src/common/constants/roles.constant';
import { UpdateUserDto } from '../../dto/update-user.dto';

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
        role: true,
        avatar: true,
        phones: {
          where: {
            is_default: true,
          },
        },
      },
    });

    if (!prismaUser) return null;
    const { avatar, password, salt, phones, ...rest } = prismaUser;
    return {
      ...rest,
      phone: phones?.[0],
      avatar_url: avatar?.url,
    };
  }

  async findByEmail(email: string, withSalt?: boolean): Promise<IUser | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        avatar: true,
        phones: {
          where: {
            is_default: true,
          },
        },
      },
    });

    if (!prismaUser) return null;
    const { avatar, password, salt, phones, ...rest } = prismaUser;
    return {
      ...rest,
      avatar_url: avatar?.url,
      phone: phones?.[0],
      ...(withSalt ? { password, salt } : {}),
    };
  }
  async updateUserProfile(id: string, updateData: UpdateUserDto): Promise<IUser> {
    const { phone_number, phone_code, avatar_url, ...userData } = updateData;
    const isUpdatePhone = phone_number && phone_code;
    // Wrap everything in an interactive transaction
    const updatedUser = await this.prisma.$transaction(async (tx) => {
      if (isUpdatePhone) {
        await tx.userPhone.updateMany({
          where: {
            user_id: id,
            is_default: true,
          },
          data: {
            is_default: false,
          },
        });

        // Create the new default phone
        await tx.userPhone.create({
          data: {
            user_id: id,
            phone_number,
            phone_code,
            is_default: true,
          },
        });
      }

      // 2. Update the user profile and fetch the final state
      return tx.user.update({
        where: { id },
        data: {
          ...userData,
          ...(avatar_url && {
            avatar: {
              connect: {
                id: avatar_url,
              },
            },
          }),
        },
        include: {
          avatar: true,
          phones: true,
        },
      });
    });

    const { avatar, password, salt, phones, ...rest } = updatedUser;

    return {
      ...rest,
      avatar_url: avatar?.url,
      phone: phones?.[0],
    };
  }

  async updatePassword(id: string, passwordRaw: string): Promise<IUser> {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(passwordRaw, salt, 1000, 64, 'sha512').toString('hex');
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const prismaUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        salt,
      },
    });

    return prismaUser;
  }

  async create(data: { email: string; first_name: string; last_name: string; password: string }): Promise<IUser> {
    const newSalt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(data.password, newSalt, 1000, 64, 'sha512').toString('hex');

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        salt: newSalt,
        role: {
          connect: { role_name: ROLE_USER },
        },
      },
      include: { role: true, avatar: true },
    });
    const { avatar, password, salt, ...rest } = user;
    return { ...rest, avatar_url: avatar?.url };
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
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    return user?.role?.permissions.map((p) => p.permission.permission_name) || [];
  }

  async getUserAvatarPublicId(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        avatar: true,
      },
    });

    return user?.avatar?.public_id || null;
  }

  async addUserPhone(
    userId: string,
    data: { phone_number: string; phone_code: string; is_verified: boolean; is_default: boolean },
  ): Promise<boolean> {
    await this.prisma.userPhone.create({
      data: {
        user_id: userId,
        phone_number: data.phone_number,
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
