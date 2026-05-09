import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CreateTagUseCase } from './use-cases/create-tag.use-case';
import { FindAllTagsUseCase } from './use-cases/find-all-tags.use-case';
import { FindOneTagUseCase } from './use-cases/find-one-tag.use-case';
import { UpdateTagUseCase } from './use-cases/update-tag.use-case';
import { RemoveTagUseCase } from './use-cases/remove-tag.use-case';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import createSuccessResponse from 'src/common/respomse';
import { GetTagsDto } from './dto/get-tags.dto';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { PermissionsGuard } from 'src/api/auth/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('tags')
export class TagsController {
  constructor(
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly findAllTagsUseCase: FindAllTagsUseCase,
    private readonly findOneTagUseCase: FindOneTagUseCase,
    private readonly updateTagUseCase: UpdateTagUseCase,
    private readonly removeTagUseCase: RemoveTagUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('CREATE:TAG')
  async create(@Body() createTagDto: CreateTagDto) {
    const result = await this.createTagUseCase.execute(createTagDto);
    return createSuccessResponse(result);
  }

  @Get()
  async findAll(@Query() paginationDto: GetTagsDto) {
    const result = await this.findAllTagsUseCase.execute(paginationDto.page, paginationDto.limit);
    return createSuccessResponse(result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.findOneTagUseCase.execute(id);
    return createSuccessResponse(result);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('UPDATE:TAG')
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const result = await this.updateTagUseCase.execute(id, updateTagDto);
    return createSuccessResponse(result);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('DELETE:TAG')
  async remove(@Param('id') id: string) {
    const result = await this.removeTagUseCase.execute(id);
    return createSuccessResponse(result);
  }
}
