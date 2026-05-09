import { Injectable, Inject } from '@nestjs/common';
import { ICommentsRepository } from '../entities/comments.repository.interface';

@Injectable()
export class GetRepliesUseCase {
  constructor(
    @Inject(ICommentsRepository)
    private readonly commentsRepository: ICommentsRepository,
  ) {}

  async execute(parentId: string, page: number, limit: number) {
    return this.commentsRepository.getReplies(parentId, page, limit);
  }
}
