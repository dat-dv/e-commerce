import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/config.validation';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly configService: ConfigService<AppConfig>,
  ) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    const port = this.configService.get('PORT', { infer: true });
    const db = this.configService.get('DATABASE_URL', { infer: true });
    const accessTokenSecret = this.configService.get('ACCESS_TOKEN_SECRET', { infer: true });
    const accessTokenExpiresIn = this.configService.get('ACCESS_TOKEN_EXPIRES_IN', { infer: true });
    const refreshTokenSecret = this.configService.get('REFRESH_TOKEN_SECRET', { infer: true });
    const refreshTokenExpiresIn = this.configService.get('REFRESH_TOKEN_EXPIRES_IN', { infer: true });
    console.log(accessTokenSecret);
    console.log(accessTokenExpiresIn);
    console.log(refreshTokenSecret);
    console.log(refreshTokenExpiresIn);
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
