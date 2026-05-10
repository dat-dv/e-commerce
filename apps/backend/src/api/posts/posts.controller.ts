import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreatePostUseCase } from './domain/use-cases/create-post.use-case';
import { FindAllPostsUseCase } from './domain/use-cases/find-all-posts.use-case';
import { FindOnePostUseCase } from './domain/use-cases/find-one-post.use-case';
import { UpdatePostUseCase } from './domain/use-cases/update-post.use-case';
import { RemovePostUseCase } from './domain/use-cases/remove-post.use-case';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostsDto } from './dto/get-posts.dto';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/config/config.validation';
import createSuccessResponse from 'src/common/respomse';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly findAllPostsUseCase: FindAllPostsUseCase,
    private readonly findOnePostUseCase: FindOnePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly removePostUseCase: RemovePostUseCase,
    private readonly configService: ConfigService<EnvVars>,
  ) {}

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('CREATE:POST')
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        thumbnail: {
          type: 'string',
          format: 'binary',
        },
        title: { type: 'string' },
        slug: { type: 'string' },
        content: { type: 'object' },
        status: { type: 'string' },
        tag_ids: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  async create(
    @Req() req: Express.Request,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const res = await this.createPostUseCase.execute(req.user.sub, createPostDto, file);
    return createSuccessResponse(res);
  }

  @Get()
  async findAll(@Query() getPostsDto: GetPostsDto) {
    const res = await this.findAllPostsUseCase.execute(getPostsDto.page, getPostsDto.limit);
    return createSuccessResponse(res);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.findOnePostUseCase.execute(id);
    return createSuccessResponse(res);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        thumbnail: {
          type: 'string',
          format: 'binary',
        },
        title: { type: 'string' },
        slug: { type: 'string' },
        content: { type: 'object' },
        status: { type: 'string' },
        tag_ids: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  async update(
    @Req() req: Express.Request,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const res = await this.updatePostUseCase.execute(id, req.user.sub, updatePostDto, file);
    return createSuccessResponse(res);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Req() req: Express.Request, @Param('id') id: string) {
    const res = await this.removePostUseCase.execute(id, req.user.sub);
    return createSuccessResponse(res);
  }
}
