import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import createSuccessResponse from 'src/common/respomse';
import { GetTagsDto } from './dto/get-tags.dto';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { PermissionsGuard } from 'src/api/auth/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('CREATE:TAG')
  async create(@Body() createTagDto: CreateTagDto) {
    const result = await this.tagsService.create(createTagDto);
    return createSuccessResponse(result);
  }

  @Get()
  async findAll(@Query() paginationDto: GetTagsDto) {
    const result = await this.tagsService.findAll(paginationDto.page, paginationDto.limit);
    return createSuccessResponse(result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.tagsService.findOne(id);
    return createSuccessResponse(result);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('UPDATE:TAG')
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const result = await this.tagsService.update(id, updateTagDto);
    return createSuccessResponse(result);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('DELETE:TAG')
  async remove(@Param('id') id: string) {
    const result = await this.tagsService.remove(id);
    return createSuccessResponse(result);
  }
}
