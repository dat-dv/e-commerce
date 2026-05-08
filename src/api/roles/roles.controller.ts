import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { GetRolesDto } from './dto/get-roles.dto';
import createSuccessResponse from 'src/common/respomse';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('roles')
@UseGuards(AuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const res = await this.rolesService.create(createRoleDto);
    return createSuccessResponse(res);
  }

  @Get()
  async findAll(@Query() getRolesDto: GetRolesDto) {
    const res = await this.rolesService.findAll(getRolesDto.page, getRolesDto.limit);
    return createSuccessResponse(res);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.rolesService.findOne(id);
    return createSuccessResponse(res);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const res = await this.rolesService.update(id, updateRoleDto);
    return createSuccessResponse(res);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.rolesService.remove(id);
    return createSuccessResponse(res);
  }
}
