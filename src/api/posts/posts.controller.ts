import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostsDto } from './dto/get-posts.dto';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/config/config.validation';
import createSuccessResponse from 'src/common/respomse';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly configService: ConfigService<EnvVars>,
  ) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    const res = await this.postsService.create(createPostDto);
    return createSuccessResponse(res);
  }

  @Get()
  async findAll(@Query() getPostsDto: GetPostsDto) {
    const res = await this.postsService.findAll(getPostsDto.page, getPostsDto.limit);
    return createSuccessResponse(res);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.postsService.findOne(id);
    return createSuccessResponse(res);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const res = await this.postsService.update(id, updatePostDto);
    return createSuccessResponse(res);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.postsService.remove(id);
    return createSuccessResponse(res);
  }
}
