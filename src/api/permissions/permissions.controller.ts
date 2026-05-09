import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { FindAllPermissionsUseCase } from './use-cases/find-all-permissions.use-case';
import { FindOnePermissionUseCase } from './use-cases/find-one-permission.use-case';
import { UpdatePermissionUseCase } from './use-cases/update-permission.use-case';
import { RemovePermissionUseCase } from './use-cases/remove-permission.use-case';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { GetPermissionsDto } from './dto/get-permissions.dto';
import createSuccessResponse from 'src/common/respomse';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('permissions')
@UseGuards(AuthGuard)
export class PermissionsController {
  constructor(
    private readonly findAllPermissionsUseCase: FindAllPermissionsUseCase,
    private readonly findOnePermissionUseCase: FindOnePermissionUseCase,
    private readonly updatePermissionUseCase: UpdatePermissionUseCase,
    private readonly removePermissionUseCase: RemovePermissionUseCase,
  ) {}

  @Get()
  async findAll(@Query() getPermissionsDto: GetPermissionsDto) {
    const res = await this.findAllPermissionsUseCase.execute(getPermissionsDto.page, getPermissionsDto.limit);
    return createSuccessResponse(res);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.findOnePermissionUseCase.execute(id);
    return createSuccessResponse(res);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    const res = await this.updatePermissionUseCase.execute(id, updatePermissionDto);
    return createSuccessResponse(res);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.removePermissionUseCase.execute(id);
    return createSuccessResponse(res);
  }
}
