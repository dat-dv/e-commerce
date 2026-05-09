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
import { UsersService } from './users.service';
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
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions('CREATE:USER')
  async create(@Body() dto: CreateUserDto) {
    const res = await this.usersService.create(dto);
    return createSuccessResponse(res);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions('LIST:USER')
  async findAll(@Query() paginationDto: GetUsersDto) {
    const res = await this.usersService.findAll(paginationDto.page, paginationDto.limit);
    return createSuccessResponse(res);
  }

  @Get(':id')
  async findOne(@Req() req: Express.Request, @Param('id') id: string) {
    const res = await this.usersService.findOne(id, req.user.sub);
    return createSuccessResponse(res);
  }

  @Patch(':id')
  async update(@Req() req: Express.Request, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const res = await this.usersService.update(id, req.user.sub, updateUserDto);
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
    const res = await this.usersService.updateAvatar(id, req.user.sub, file);
    return createSuccessResponse(res);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('DELETE:USER')
  async remove(@Param('id') id: string) {
    const res = await this.usersService.remove(id);
    return createSuccessResponse(res);
  }
}
