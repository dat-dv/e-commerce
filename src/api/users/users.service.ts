import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Prisma, Image } from 'generated/prisma/client';
import { handlePrismaNotFound } from '../../common/utils/prisma.util';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { UploadService } from 'src/api/upload/upload.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly uploadService: UploadService,
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

  async findOne(id: string, requestingUserId: string) {
    await this.checkOwnershipOrPermission(id, requestingUserId, 'DETAIL:OWN_USER', 'DETAIL:ANY_USER');

    return handlePrismaNotFound(
      this.prisma.user.findUniqueOrThrow({ where: { user_id: id, deleted_at: null } }),
      'User not found',
    );
  }

  async update(id: string, requestingUserId: string, updateUserDto: UpdateUserDto) {
    await this.checkOwnershipOrPermission(id, requestingUserId, 'UPDATE:OWN_USER', 'UPDATE:ANY_USER');

    return handlePrismaNotFound(
      this.prisma.user.update({
        where: { user_id: id, deleted_at: null },
        data: updateUserDto,
      }),
      'User not found',
    );
  }

  async updateAvatar(id: string, requestingUserId: string, file: Express.Multer.File) {
    await this.checkOwnershipOrPermission(id, requestingUserId, 'UPDATE:OWN_USER', 'UPDATE:ANY_USER');

    const user = await this.prisma.user.findUnique({
      where: { user_id: id },
      include: { avatar: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const image = await this.uploadService.uploadImage(file);

    const updatedUser = await this.prisma.user.update({
      where: { user_id: id },
      data: { avatar_id: image.id },
    });

    if (user.avatar) {
      try {
        await this.uploadService.deleteImage(user.avatar.publicId);
      } catch (error) {
        console.error('Failed to delete old avatar file from cloud or DB:', error);
      }
    }

    return updatedUser;
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

  private async checkOwnershipOrPermission(
    targetUserId: string,
    requestingUserId: string,
    ownPermission: string,
    anyPermission: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: requestingUserId },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    const userPermissions = user?.role?.permissions.map((p) => p.permission_name) || [];

    if (userPermissions.includes(anyPermission)) {
      return;
    }

    const isOwner = targetUserId === requestingUserId;
    if (isOwner) {
      if (!userPermissions.includes(ownPermission)) {
        throw new ForbiddenException(`You do not have the '${ownPermission}' permission to action on your own profile`);
      }
    } else {
      throw new ForbiddenException(
        `You do not have the '${anyPermission}' permission to action on other people's profiles`,
      );
    }
  }

  async findOneByEmail(email: string, isDeleted: boolean = false) {
    const where: Prisma.UserWhereUniqueInput = { email };
    if (!isDeleted) {
      where.deleted_at = null;
    }
    return await this.prisma.user.findUnique({ where });
  }
}
