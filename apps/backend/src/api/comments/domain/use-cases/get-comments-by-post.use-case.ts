import { Injectable, Inject } from '@nestjs/common';
import { ICommentsRepository } from '../entities/comments.repository.interface';

@Injectable()
export class GetCommentsByPostUseCase {
  constructor(
    @Inject(ICommentsRepository)
    private readonly commentsRepository: ICommentsRepository,
  ) {}

  async execute(postId: string, page: number, limit: number) {
    return this.commentsRepository.getCommentsByPost(postId, page, limit);
  }
}
