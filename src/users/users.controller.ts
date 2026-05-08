import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import createSuccessResponse from 'src/common/respomse';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    const res = this.usersService.create(dto);
    return createSuccessResponse(res);
  }

  @Get()
  findAll() {
    const res = this.usersService.findAll();
    return createSuccessResponse(res);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const res = this.usersService.findOne(id);
    return createSuccessResponse(res);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const res = this.usersService.update(id, updateUserDto);
    return createSuccessResponse(res);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const res = this.usersService.remove(id);
    return createSuccessResponse(res);
  }
}
