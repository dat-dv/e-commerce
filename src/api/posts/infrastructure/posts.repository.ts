import { Injectable } from '@nestjs/common';
import {
  IPostsRepository,
  PostWithRelations,
  PostDetails,
  PaginatedResult,
} from '../domain/posts.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PostsRepository implements IPostsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: Prisma.PostCreateInput): Promise<Prisma.PostGetPayload<Record<string, never>>> {
    return this.prisma.post.create({
      data,
    });
  }

  async findAll(page: number, limit: number): Promise<PaginatedResult<PostWithRelations>> {
    return this.paginationService.paginate<PostWithRelations>(
      this.prisma.post,
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

  async findById(id: string): Promise<PostDetails | null> {
    return this.prisma.post.findUnique({
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
  }

  async update(id: string, data: Prisma.PostUpdateInput): Promise<Prisma.PostGetPayload<Record<string, never>>> {
    return this.prisma.post.update({
      where: { post_id: id, deleted_at: null },
      data,
    });
  }

  async delete(id: string): Promise<Prisma.PostGetPayload<Record<string, never>>> {
    return this.prisma.post.update({
      where: { post_id: id, deleted_at: null },
      data: { deleted_at: new Date() },
    });
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    return user?.role?.permissions.map((p) => p.permission_name) || [];
  }

  async countTags(tagIds: string[]): Promise<number> {
    return this.prisma.tag.count({
      where: { id: { in: tagIds } },
    });
  }
}
