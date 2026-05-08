import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostsDto } from './dto/get-posts.dto';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/config/config.validation';
import createSuccessResponse from 'src/common/respomse';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import express from 'express';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly configService: ConfigService<EnvVars>,
  ) {}

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('CREATE:POST')
  async create(@Req() req: Express.Request, @Body() createPostDto: CreatePostDto) {
    const res = await this.postsService.create(req.user.sub, createPostDto);
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
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('UPDATE:POST')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    // TODO: only admin or owner do action
    const res = await this.postsService.update(id, updatePostDto);
    return createSuccessResponse(res);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('DELETE:POST')
  async remove(@Param('id') id: string) {
    // TODO: only admin or owner do action
    const res = await this.postsService.remove(id);
    return createSuccessResponse(res);
  }
}
