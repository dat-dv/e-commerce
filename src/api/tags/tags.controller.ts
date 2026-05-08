import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import createSuccessResponse from 'src/common/respomse';
import { GetTagsDto } from './dto/get-tags.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
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
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const result = await this.tagsService.update(id, updateTagDto);
    return createSuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.tagsService.remove(id);
    return createSuccessResponse(result);
  }
}
