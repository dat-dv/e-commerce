import { IPaginatedResult, IUserAvatarResponse, IUserResponse } from '@ecommerce/shared';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ROLE_USER } from 'src/common/constants/roles.constant';
import { hashPassword } from 'src/common/utils/password.util';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Prisma } from '../../../../../generated/prisma/client';
import { IUsersRepository } from '../entities/users.repository.interface';

import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserAvatarResponseDto } from '../../dto/user-avatar-response.dto';
import { UserResponseDto } from '../../dto/user-response.dto';
import { GetUsersDto } from '../../dto/get-users.dto';

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
    active_phone: true,
    phones: true,
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
    const { phone, phone_code, avatar_id, date_of_birth, role_id, ...userData } = updateData;
    const isUpdatePhone = !!(phone && phone_code);

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      let activePhoneConnectId: string | undefined;
      if (isUpdatePhone) {
        const existingPhone = await tx.userPhone.findUnique({
          where: {
            user_id_phone: {
              user_id: id,
              phone,
            },
          },
        });

        if (existingPhone) {
          await tx.userPhone.update({
            where: { id: existingPhone.id },
            data: {
              phone_code,
            },
          });
          activePhoneConnectId = existingPhone.id;
        } else {
          const createdPhone = await tx.userPhone.create({
            data: {
              user_id: id,
              phone,
              phone_code,
            },
            select: { id: true },
          });
          activePhoneConnectId = createdPhone.id;
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
          ...(activePhoneConnectId && {
            active_phone: {
              connect: {
                id: activePhoneConnectId,
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
    const res = await this.prisma.user.update({
      where: { id },
      data: {
        password: hashPassword(passwordRaw),
      },
      include: this.USER_INCLUDE,
    });
    return new UserResponseDto(res);
  }

  async create(data: CreateUserDto): Promise<IUserResponse> {
    const { confirm_password, ...dbData } = data;

    const res = await this.prisma.user.create({
      data: {
        ...dbData,
        password: data.password ? hashPassword(data.password) : '',
        role: {
          connect: { role_name: ROLE_USER },
        },
      },
      include: this.USER_INCLUDE,
    });
    return new UserResponseDto(res);
  }

  async findAll(query: GetUsersDto): Promise<IPaginatedResult<IUserResponse>> {
    const { page, limit, search, roleId, gender, sortBy } = query;
    const where: Prisma.UserWhereInput = { deleted_at: null };

    if (search) {
      where.OR = [
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (roleId) {
      where.role_id = roleId;
    }

    if (gender) {
      where.gender = Number(gender);
    }

    let orderBy: Prisma.UserOrderByWithRelationInput = { created_at: 'desc' };
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      if (field === 'name') {
        orderBy = { first_name: order as 'asc' | 'desc' };
      } else {
        orderBy = { [field]: order as 'asc' | 'desc' };
      }
    }

    const result = await this.paginationService.paginate(
      this.prisma.user,
      {
        where,
        include: this.USER_INCLUDE,
        orderBy,
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
    data: { phone: string; phone_code: string; is_verified: boolean },
  ): Promise<boolean> {
    const phone = await this.prisma.userPhone.upsert({
      where: {
        user_id_phone: {
          user_id: userId,
          phone: data.phone,
        },
      },
      update: {
        phone_code: data.phone_code,
        is_verified: data.is_verified,
      },
      create: {
        user_id: userId,
        phone: data.phone,
        phone_code: data.phone_code,
        is_verified: data.is_verified,
      },
      select: { id: true },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        active_phone: {
          connect: { id: phone.id },
        },
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
