import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { handlePrismaNotFound } from '../../common/utils/prisma.util';

@Injectable()
export class PostsService {
  constructor(private readonly prismaClient: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const { tag_ids = [], ...postData } = createPostDto;

    const post_tags = {
      create: tag_ids.map((tag_id) => ({ tag_id })),
    };

    return this.prismaClient.post.create({
      data: {
        ...postData,
        post_tags,
      },
      include: {
        post_tags: true,
      },
    });
  }

  async findAll() {
    return this.prismaClient.post.findMany({
      where: { deleted_at: null },
      include: {
        post_tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return handlePrismaNotFound(
      this.prismaClient.post.findUniqueOrThrow({
        where: { post_id: id, deleted_at: null },
        include: {
          post_tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      'Post not found',
    );
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const { tag_ids, ...postData } = updatePostDto;

    return handlePrismaNotFound(
      this.prismaClient.post.update({
        where: { post_id: id, deleted_at: null },
        data: {
          ...postData,
          post_tags: tag_ids
            ? {
                deleteMany: {},
                create: tag_ids.map((tag_id) => ({ tag_id })),
              }
            : undefined,
        },
        include: {
          post_tags: true,
        },
      }),
      'Post not found',
    );
  }

  async remove(id: string) {
    return handlePrismaNotFound(
      this.prismaClient.post.update({
        where: { post_id: id, deleted_at: null },
        data: { deleted_at: new Date() },
      }),
      'Post not found',
    );
  }
}
