import { Injectable, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { IPostsRepository } from '../entities/posts.repository.interface';
import { UpdatePostDto } from '../../dto/update-post.dto';
import { generateSlug } from 'src/common/utils/generate-slug';
import { UploadImageUseCase } from '../../../upload/domain/use-cases/upload-image.use-case';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UpdatePostUseCase {
  constructor(
    @Inject(IPostsRepository)
    private readonly postsRepository: IPostsRepository,
    private readonly uploadImageUseCase: UploadImageUseCase,
  ) {}

  async execute(id: string, requestingUserId: string, updatePostDto: UpdatePostDto, file?: Express.Multer.File) {
    const { tag_ids, ...postData } = updatePostDto;

    // Fetch current post to compare slug and check ownership
    const currentPost = await this.postsRepository.findById(id);
    if (!currentPost) {
      throw new BadRequestException('Post not found');
    }

    await this.checkOwnershipOrPermission(currentPost.user_id, requestingUserId, 'UPDATE:OWN_POST', 'UPDATE:ANY_POST');

    let slug = currentPost.slug;
    if (postData.slug && postData.slug !== currentPost.slug) {
      slug = generateSlug(postData.slug);
    }

    let thumbnail_id = currentPost.thumbnail_id;
    if (file) {
      try {
        const image = await this.uploadImageUseCase.execute(file);
        thumbnail_id = image.id;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new BadRequestException(`Failed to upload thumbnail: ${message}`);
      }
    }

    // Prepare data for Prisma
    const data: Prisma.PostUpdateInput = {
      ...postData,
      slug,
      thumbnail: thumbnail_id ? { connect: { id: thumbnail_id } } : undefined,
      post_tags: tag_ids
        ? {
            deleteMany: {},
            create: tag_ids.map((tag_id) => ({ tag_id })),
          }
        : undefined,
    };

    return this.postsRepository.update(id, data);
  }

  private async checkOwnershipOrPermission(
    resourceUserId: string,
    requestingUserId: string,
    ownPermission: string,
    anyPermission: string,
  ) {
    const isOwner = resourceUserId === requestingUserId;
    const userPermissions = await this.postsRepository.getUserPermissions(requestingUserId);

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
