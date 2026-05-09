import { Injectable, Inject } from '@nestjs/common';
import { IPostsRepository } from '../domain/posts.repository.interface';

@Injectable()
export class FindAllPostsUseCase {
  constructor(
    @Inject(IPostsRepository)
    private readonly postsRepository: IPostsRepository,
  ) {}

  async execute(page: number, limit: number) {
    return this.postsRepository.findAll(page, limit);
  }
}
