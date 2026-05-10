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
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly removeUserUseCase: RemoveUserUseCase,
    private readonly updateAvatarUseCase: UpdateAvatarUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req: Express.Request, @Body() dto: UpdateUserDto) {
    const res = await this.updateUserUseCase.execute(req.user.sub, dto);
    return createSuccessResponse(res);
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions('CREATE:USER')
  async create(@Body() dto: CreateUserDto) {
    const res = await this.createUserUseCase.execute(dto);
    return createSuccessResponse(res);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions('LIST:USER')
  async findAll(@Query() paginationDto: GetUsersDto) {
    const res = await this.findAllUsersUseCase.execute(paginationDto.page, paginationDto.limit);
    return createSuccessResponse(res);
  }

  @Get(':id')
  async findOne(@Req() req: Express.Request, @Param('id') id: string) {
    const res = await this.findOneUserUseCase.execute(id, req.user.sub);
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
  async uploadAvatar(@Req() req: Express.Request, @Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    const res = await this.updateAvatarUseCase.execute(id, req.user.sub, file);
    return createSuccessResponse(res);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('DELETE:USER')
  async remove(@Param('id') id: string) {
    const res = await this.removeUserUseCase.execute(id);
    return createSuccessResponse(res);
  }
}
