import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CreateRoleUseCase } from './domain/use-cases/create-role.use-case';
import { FindAllRolesUseCase } from './domain/use-cases/find-all-roles.use-case';
import { FindOneRoleUseCase } from './domain/use-cases/find-one-role.use-case';
import { UpdateRoleUseCase } from './domain/use-cases/update-role.use-case';
import { RemoveRoleUseCase } from './domain/use-cases/remove-role.use-case';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { GetRolesDto } from './dto/get-roles.dto';
import createSuccessResponse from 'src/common/respomse';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PermissionsGuard } from 'src/api/auth/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('roles')
@UseGuards(AuthGuard, PermissionsGuard)
export class RolesController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly findAllRolesUseCase: FindAllRolesUseCase,
    private readonly findOneRoleUseCase: FindOneRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly removeRoleUseCase: RemoveRoleUseCase,
  ) {}

  @Post()
  @Permissions('CREATE:ROLE')
  async create(@Body() createRoleDto: CreateRoleDto) {
    const res = await this.createRoleUseCase.execute(createRoleDto);
    return createSuccessResponse(res);
  }

  @Get()
  @Permissions('LIST:ROLE')
  async findAll(@Query() getRolesDto: GetRolesDto) {
    const res = await this.findAllRolesUseCase.execute(getRolesDto.page, getRolesDto.limit);
    return createSuccessResponse(res);
  }

  @Get(':id')
  @Permissions('DETAIL:ROLE')
  async findOne(@Param('id') id: string) {
    const res = await this.findOneRoleUseCase.execute(id);
    return createSuccessResponse(res);
  }

  @Patch(':id')
  @Permissions('UPDATE:ROLE')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const res = await this.updateRoleUseCase.execute(id, updateRoleDto);
    return createSuccessResponse(res);
  }

  @Delete(':id')
  @Permissions('DELETE:ROLE')
  async remove(@Param('id') id: string) {
    const res = await this.removeRoleUseCase.execute(id);
    return createSuccessResponse(res);
  }
}
