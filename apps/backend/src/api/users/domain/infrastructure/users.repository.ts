import { IPaginatedResult, IUserResponse } from '@ecommerce/shared';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ROLE_USER } from 'src/common/constants/roles.constant';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Prisma } from '../../../../../generated/prisma/client';
import { IUsersRepository } from '../entities/users.repository.interface';

import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  private readonly USER_INCLUDE = {
    role: true,
    avatar: true,
    phones: {
      where: {
        is_default: true,
      },
    },
  };

  async findById(id: string): Promise<IUserResponse | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: this.USER_INCLUDE,
    });
  }

  async findByEmail(email: string): Promise<IUserResponse | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: this.USER_INCLUDE,
    });
  }

  async updateUserProfile(id: string, updateData: UpdateUserDto): Promise<IUserResponse> {
    const { phone_number, phone_code, avatar_url, date_of_birth, role_id, ...userData } = updateData;
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

      return tx.user.update({
        where: { id },
        data: {
          ...userData,
          ...(date_of_birth && { date_of_birth: new Date(date_of_birth) }),
          ...(avatar_url && {
            avatar: {
              connect: {
                id: avatar_url,
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
    });
  }

  async updatePassword(id: string, passwordRaw: string): Promise<IUserResponse> {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(passwordRaw, salt, 1000, 64, 'sha512').toString('hex');

    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        salt,
      },
      include: this.USER_INCLUDE,
    });
  }

  async create(data: CreateUserDto): Promise<IUserResponse> {
    const newSalt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = data.password
      ? crypto.pbkdf2Sync(data.password, newSalt, 1000, 64, 'sha512').toString('hex')
      : undefined;

    // Confirm password is not a database field

    const { confirm_password, ...dbData } = data;

    return this.prisma.user.create({
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

  async remove(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
