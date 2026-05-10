import { Injectable } from '@nestjs/common';
import { IPostsRepository, IPostWithRelations, IPostDetails } from '../entities/posts.repository.interface';
import { IPost } from '../entities/post.entity';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PaginatedResult, PaginationService } from 'src/shared/services/pagination/pagination.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PostsRepository implements IPostsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: Prisma.PostCreateInput): Promise<IPost> {
    return this.prisma.post.create({
      data,
    });
  }

  async findAll(page: number, limit: number): Promise<PaginatedResult<IPostWithRelations>> {
    return this.paginationService.paginate<IPostWithRelations>(
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

  async findById(id: string): Promise<IPostDetails | null> {
    return this.prisma.post.findUnique({
      where: { id, deleted_at: null },
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

  async update(id: string, data: Prisma.PostUpdateInput): Promise<IPost> {
    return this.prisma.post.update({
      where: { id, deleted_at: null },
      data,
    });
  }

  async delete(id: string): Promise<IPost> {
    return this.prisma.post.update({
      where: { id, deleted_at: null },
      data: { deleted_at: new Date() },
    });
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
