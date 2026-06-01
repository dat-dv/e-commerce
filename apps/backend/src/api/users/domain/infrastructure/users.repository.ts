import { IPaginatedResult, IUserAvatarResponse, IUserResponse } from '@ecommerce/shared';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ROLE_USER } from 'src/common/constants/roles.constant';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Prisma } from '../../../../../generated/prisma/client';
import { IUsersRepository } from '../entities/users.repository.interface';

import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserAvatarResponseDto } from '../../dto/user-avatar-response.dto';
import { UserResponseDto } from '../../dto/user-response.dto';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  private readonly USER_INCLUDE = {
    role: true,
    avatar: {
      include: {
        image: true,
      },
    },
    phones: {
      where: {
        is_default: true,
      },
    },
  };

  async findById(id: string): Promise<IUserResponse | null> {
    const res = await this.prisma.user.findUnique({
      where: { id },
      include: this.USER_INCLUDE,
    });

    return res ? new UserResponseDto(res) : null;
  }

  async findByEmail(email: string): Promise<IUserResponse | null> {
    const res = await this.prisma.user.findUnique({
      where: { email },
      include: this.USER_INCLUDE,
    });
    return res ? new UserResponseDto(res) : null;
  }

  async updateUserProfile(id: string, updateData: UpdateUserDto): Promise<IUserResponse> {
    const { phone_number, phone_code, avatar_id, date_of_birth, role_id, ...userData } = updateData;
    const isUpdatePhone = !!(phone_number && phone_code);

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (isUpdatePhone) {
        const existingPhone = await tx.userPhone.findUnique({
          where: { phone_number },
        });

        if (existingPhone) {
          if (existingPhone.user_id !== id) {
            throw new BadRequestException('Phone number is already in use by another account');
          }

          await tx.userPhone.updateMany({
            where: {
              user_id: id,
              id: { not: existingPhone.id },
            },
            data: {
              is_default: false,
            },
          });

          await tx.userPhone.update({
            where: { id: existingPhone.id },
            data: {
              phone_code,
              is_default: true,
            },
          });
        } else {
          const defaultPhone = await tx.userPhone.findFirst({
            where: {
              user_id: id,
              is_default: true,
            },
          });

          if (defaultPhone) {
            await tx.userPhone.update({
              where: { id: defaultPhone.id },
              data: {
                phone_number,
                phone_code,
              },
            });
          } else {
            await tx.userPhone.create({
              data: {
                user_id: id,
                phone_number,
                phone_code,
                is_default: true,
              },
            });
          }
        }
      }

      let avatarConnectId: string | undefined;
      if (avatar_id) {
        avatarConnectId = await this.resolveUserAvatarConnectId(tx, id, avatar_id);
      }

      const res = await tx.user.update({
        where: { id },
        data: {
          ...userData,
          ...(date_of_birth && { date_of_birth: new Date(date_of_birth) }),
          ...(avatarConnectId && {
            avatar: {
              connect: {
                id: avatarConnectId,
              },
            },
          }),
          ...(role_id && {
            role: {
              connect: {
                id: role_id,
              },
            },
          }),
        },
        include: this.USER_INCLUDE,
      });
      return new UserResponseDto(res);
    });
  }

  private async resolveUserAvatarConnectId(
    tx: Prisma.TransactionClient,
    userId: string,
    avatarId: string,
  ): Promise<string> {
    const existingUserAvatar = await tx.userAvatar.findFirst({
      where: {
        id: avatarId,
        user_id: userId,
      },
      select: { id: true },
    });

    if (existingUserAvatar) {
      return existingUserAvatar.id;
    }

    const image = await tx.image.findUnique({
      where: { id: avatarId },
      select: { id: true },
    });

    if (!image) {
      throw new BadRequestException('Avatar not found');
    }

    const userAvatar = await tx.userAvatar.upsert({
      where: {
        user_id_image_id: {
          user_id: userId,
          image_id: image.id,
        },
      },
      update: {},
      create: {
        user_id: userId,
        image_id: image.id,
      },
      select: { id: true },
    });

    return userAvatar.id;
  }

  async updatePassword(id: string, passwordRaw: string): Promise<IUserResponse> {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(passwordRaw, salt, 1000, 64, 'sha512').toString('hex');

    const res = await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        salt,
      },
      include: this.USER_INCLUDE,
    });
    return new UserResponseDto(res);
  }

  async create(data: CreateUserDto): Promise<IUserResponse> {
    const newSalt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = data.password
      ? crypto.pbkdf2Sync(data.password, newSalt, 1000, 64, 'sha512').toString('hex')
      : undefined;

    // Confirm password is not a database field

    const { confirm_password, ...dbData } = data;

    const res = await this.prisma.user.create({
      data: {
        ...dbData,
        password: hashedPassword || '',
        salt: hashedPassword ? newSalt : '',
        role: {
          connect: { role_name: ROLE_USER },
        },
      },
      include: this.USER_INCLUDE,
    });
    return new UserResponseDto(res);
  }

  async findAll(page: number, limit: number): Promise<IPaginatedResult<IUserResponse>> {
    const result = await this.paginationService.paginate(
      this.prisma.user,
      {
        where: { deleted_at: null },
        include: this.USER_INCLUDE,
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

    if (!user?.role) return [];

    return user.role.permissions.map((p) => p.permission.permission_name);
  }

  async getUserAvatarPublicId(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        avatar: {
          include: {
            image: true,
          },
        },
      },
    });

    return user?.avatar?.image?.public_id || null;
  }

  async findUserAvatars(userId: string): Promise<IUserAvatarResponse[] | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        avatars: {
          include: {
            image: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    if (!user) return null;

    return user.avatars.map((avatar) => new UserAvatarResponseDto(avatar, avatar.id === user.avatar_id));
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

  async remove(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
