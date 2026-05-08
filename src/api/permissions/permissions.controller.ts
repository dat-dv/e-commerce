import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { GetPermissionsDto } from './dto/get-permissions.dto';
import createSuccessResponse from 'src/common/respomse';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('permissions')
@UseGuards(AuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    const res = await this.permissionsService.create(createPermissionDto);
    return createSuccessResponse(res);
  }

  @Get()
  async findAll(@Query() getPermissionsDto: GetPermissionsDto) {
    const res = await this.permissionsService.findAll(getPermissionsDto.page, getPermissionsDto.limit);
    return createSuccessResponse(res);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.permissionsService.findOne(id);
    return createSuccessResponse(res);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    const res = await this.permissionsService.update(id, updatePermissionDto);
    return createSuccessResponse(res);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.permissionsService.remove(id);
    return createSuccessResponse(res);
  }
}
