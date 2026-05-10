import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IPostsRepository } from '../entities/posts.repository.interface';
import { CreatePostDto } from '../../dto/create-post.dto';
import { generateSlug } from 'src/common/utils/generate-slug';
import { UploadImageUseCase } from '../../../upload/domain/use-cases/upload-image.use-case';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(IPostsRepository)
    private readonly postsRepository: IPostsRepository,
    private readonly uploadImageUseCase: UploadImageUseCase,
  ) {}

  async execute(user_id: string, createPostDto: CreatePostDto, file?: Express.Multer.File) {
    const { tag_ids = [], ...postData } = createPostDto;

    // Verify all tags exist
    if (tag_ids.length > 0) {
      const existingTagsCount = await this.postsRepository.countTags(tag_ids);
      if (existingTagsCount !== tag_ids.length) {
        throw new BadRequestException('The tag is not existed');
      }
    }

    const slug = generateSlug(postData.slug || postData.title);
    const listTagIds = tag_ids.map((tag_id) => ({ tag_id }));
    const post_tags = listTagIds.length ? { create: listTagIds } : undefined;

    let thumbnail_id: string | undefined;

    // Handle file upload if present
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
    const data: Prisma.PostCreateInput = {
      ...postData,
      slug,
      post_tags,
      user: { connect: { id: user_id } },
      thumbnail: thumbnail_id ? { connect: { id: thumbnail_id } } : undefined,
    };

    return this.postsRepository.create(data);
  }
}
