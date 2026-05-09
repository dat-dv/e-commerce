import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IPostsRepository } from '../domain/posts.repository.interface';

@Injectable()
export class FindOnePostUseCase {
  constructor(
    @Inject(IPostsRepository)
    private readonly postsRepository: IPostsRepository,
  ) {}

  async execute(id: string) {
    const data = await this.postsRepository.findById(id);
    if (!data) {
      throw new BadRequestException('Post not found');
    }

    const { _count, ...postData } = data;
    return {
      ...postData,
      total_comments: _count.comments,
    };
  }
}
