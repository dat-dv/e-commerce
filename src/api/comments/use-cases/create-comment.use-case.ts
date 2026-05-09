import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ICommentsRepository } from '../domain/comments.repository.interface';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    @Inject(ICommentsRepository)
    private readonly commentsRepository: ICommentsRepository,
  ) {}

  async execute(userId: string, postId: string, content: string, parentId?: string) {
    let finalParentId: string | null | undefined = parentId;

    if (parentId) {
      const parentComment = await this.commentsRepository.findById(parentId);

      if (!parentComment) {
        throw new BadRequestException('Parent comment not found');
      }

      if (parentComment.parent_id) {
        finalParentId = parentComment.parent_id;
      }
    }

    return this.commentsRepository.create({
      content,
      post_id: postId,
      user_id: userId,
      parent_id: finalParentId,
    });
  }
}
