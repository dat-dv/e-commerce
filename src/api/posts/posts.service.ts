import { BadRequestException, Injectable, ForbiddenException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { handlePrismaNotFound } from '../../common/utils/prisma.util';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { generateSlug } from 'src/common/utils/generate-slug';

@Injectable()
export class PostsService {
  constructor(
    private readonly prismaClient: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(user_id: string, createPostDto: CreatePostDto) {
    const { tag_ids = [], ...postData } = createPostDto;

    if (tag_ids.length > 0) {
      const existingTags = await this.prismaClient.tag.findMany({
        where: { id: { in: tag_ids } },
      });
      if (existingTags.length !== tag_ids.length) {
        throw new BadRequestException('The tag is not existed');
      }
    }
    const slug = generateSlug(postData.slug || postData.title);
    const listTagIds = tag_ids.map((tag_id) => ({ tag_id }));
    const post_tags = listTagIds.length ? { create: listTagIds } : undefined;
    return this.prismaClient.post.create({
      data: {
        ...postData,
        slug,
        post_tags,
        user_id,
      },
      include: {
        post_tags: true,
      },
    });
  }

  async findAll(page: number, limit: number) {
    return this.paginationService.paginate(
      this.prismaClient.post,
      {
        where: { deleted_at: null },
        include: {
          post_tags: {
            include: {
              tag: true,
            },
          },
        },
      },
      page,
      limit,
    );
  }

  async findOne(id: string) {
    const findPost = this.prismaClient.post.findUniqueOrThrow({
      where: { post_id: id, deleted_at: null },
      include: {
        post_tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    const data = await handlePrismaNotFound(findPost, 'Post not found');
    const { _count, ...postData } = data;
    return {
      ...postData,
      total_comments: _count.comments,
    };
  }

  async update(id: string, requestingUserId: string, updatePostDto: UpdatePostDto) {
    const { tag_ids, ...postData } = updatePostDto;

    // Fetch current post to compare slug
    const findPost = this.prismaClient.post.findUniqueOrThrow({
      where: { post_id: id, deleted_at: null },
    });
    const currentPost = await handlePrismaNotFound(findPost, 'Post not found');

    await this.checkOwnershipOrPermission(currentPost.user_id, requestingUserId, 'UPDATE:OWN_POST', 'UPDATE:ANY_POST');

    let slug = currentPost.slug;
    if (postData.slug && postData.slug !== currentPost.slug) {
      slug = generateSlug(postData.slug);
    }

    const updatePost = this.prismaClient.post.update({
      where: { post_id: id, deleted_at: null },
      data: {
        ...postData,
        slug,
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
    });
    return handlePrismaNotFound(updatePost, 'Post not found');
  }

  async remove(id: string, requestingUserId: string) {
    const findPost = this.prismaClient.post.findUniqueOrThrow({
      where: { post_id: id, deleted_at: null },
    });
    const currentPost = await handlePrismaNotFound(findPost, 'Post not found');
    await this.checkOwnershipOrPermission(currentPost.user_id, requestingUserId, 'DELETE:OWN_POST', 'DELETE:ANY_POST');
    return handlePrismaNotFound(
      this.prismaClient.post.update({
        where: { post_id: id, deleted_at: null },
        data: { deleted_at: new Date() },
      }),
      'Post not found',
    );
  }

  private async checkOwnershipOrPermission(
    resourceUserId: string,
    requestingUserId: string,
    ownPermission: string,
    anyPermission: string,
  ) {
    const isOwner = resourceUserId === requestingUserId;

    const user = await this.prismaClient.user.findUnique({
      where: { user_id: requestingUserId },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    const userPermissions = user?.role?.permissions.map((p) => p.permission_name) || [];

    if (isOwner) {
      if (!userPermissions.includes(ownPermission)) {
        throw new ForbiddenException(
          `You do not have the '${ownPermission}' permission to action on your own resource`,
        );
      }
    } else {
      if (!userPermissions.includes(anyPermission)) {
        throw new ForbiddenException(
          `You do not have the '${anyPermission}' permission to action on other people's resources`,
        );
      }
    }
  }
}
