import type { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateUserUseCase } from './domain/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './domain/use-cases/update-user.use-case';
import { FindAllUsersUseCase } from './domain/use-cases/find-all-users.use-case';
import { FindOneUserUseCase } from './domain/use-cases/find-one-user.use-case';
import { GetUserAvatarsUseCase } from './domain/use-cases/get-user-avatars.use-case';
import { RemoveUserUseCase } from './domain/use-cases/remove-user.use-case';
import { UpdateAvatarUseCase } from './domain/use-cases/update-avatar.use-case';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import createSuccessResponse from 'src/common/respomse';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { GetUsersDto } from './dto/get-users.dto';
import { PermissionsGuard } from 'src/api/auth/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UploadImageUseCase } from '../upload/domain/use-cases/upload-image.use-case';
import { IApiResponse, IImage, IUserAvatarResponse, IUserProfileResponse, IGetUsersResponse } from '@ecommerce/shared';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly getUserAvatarsUseCase: GetUserAvatarsUseCase,
    private readonly removeUserUseCase: RemoveUserUseCase,
    private readonly updateAvatarUseCase: UpdateAvatarUseCase,
    private readonly uploadImageUseCase: UploadImageUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update profile' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'The profile avatar image to upload',
        },
        first_name: {
          type: 'string',
          example: '',
        },
        last_name: {
          type: 'string',
          example: '',
        },
        password: {
          type: 'string',
          minLength: 6,
          example: '',
        },
        date_of_birth: {
          type: 'string',
          format: 'date',
        },
        gender: {
          type: 'number',
        },
        avatar_id: {
          type: 'string',
          description: 'Existing user avatar id or image id',
        },
        phone: {
          type: 'string',
          example: '',
        },
        phone_code: {
          type: 'string',
          example: '',
        },
      },
    },
  })
  @Patch('profile')
  async updateProfile(
    @Req() req: Request,
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: UpdateUserDto,
  ): Promise<IApiResponse<IUserProfileResponse>> {
    const { avatar_id, ...profileData } = dto;
    let avatar: IImage | null = null;
    if (image) {
      avatar = await this.uploadImageUseCase.execute(image);
    }

    const res = await this.updateUserUseCase.execute(req.user?.sub, {
      ...profileData,
      ...(avatar?.id ? { avatar_id: avatar.id } : {}),
    });

    return createSuccessResponse(res);
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions('CREATE:USER')
  async create(@Body() dto: CreateUserDto): Promise<IApiResponse<IUserProfileResponse>> {
    const res = await this.createUserUseCase.execute(dto);
    return createSuccessResponse(res);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions('LIST:USER')
  async findAll(@Query() paginationDto: GetUsersDto): Promise<IApiResponse<IGetUsersResponse>> {
    const res = await this.findAllUsersUseCase.execute(paginationDto.page, paginationDto.limit);
    return createSuccessResponse(res);
  }

  @Get('/avatars')
  @UseGuards(AuthGuard)
  async getCurrentUserAvatar(@Req() req: Request): Promise<IApiResponse<IUserAvatarResponse[]>> {
    const res = await this.getUserAvatarsUseCase.execute(req.user?.sub);
    return createSuccessResponse(res);
  }

  @Get(':id/avatars')
  @UseGuards(PermissionsGuard)
  @Permissions('LIST:USER')
  async getAvatars(@Req() req: Request, @Param('id') id: string): Promise<IApiResponse<IUserAvatarResponse[]>> {
    const res = await this.getUserAvatarsUseCase.execute(id);
    return createSuccessResponse(res);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string): Promise<IApiResponse<IUserProfileResponse>> {
    const res = await this.findOneUserUseCase.execute(id, req.user?.sub);
    return createSuccessResponse(res);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('UPDATE:ANY_USER')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<IApiResponse<IUserProfileResponse>> {
    const res = await this.updateUserUseCase.execute(id, dto);
    return createSuccessResponse(res);
  }

  @Patch(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAvatar(
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IApiResponse<IUserProfileResponse>> {
    const res = await this.updateAvatarUseCase.execute(id, req.user?.sub, file);
    return createSuccessResponse(res);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('DELETE:USER')
  async remove(@Param('id') id: string): Promise<IApiResponse<boolean>> {
    const res = await this.removeUserUseCase.execute(id);
    return createSuccessResponse(res);
  }
}
