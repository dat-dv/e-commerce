import { Injectable, ForbiddenException, NotFoundException, Inject } from '@nestjs/common';
import { ICommentsRepository } from '../domain/comments.repository.interface';

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    @Inject(ICommentsRepository)
    private readonly commentsRepository: ICommentsRepository,
  ) {}

  async execute(id: string, requestingUserId: string, content: string) {
    const comment = await this.commentsRepository.findById(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.checkOwnershipOrPermission(
      comment.user_id,
      requestingUserId,
      'UPDATE:OWN_COMMENT',
      'UPDATE:ANY_COMMENT',
    );

    return this.commentsRepository.update(id, { content });
  }

  private async checkOwnershipOrPermission(
    resourceUserId: string,
    requestingUserId: string,
    ownPermission: string,
    anyPermission: string,
  ) {
    const userPermissions = await this.commentsRepository.getUserPermissions(requestingUserId);

    if (userPermissions.includes(anyPermission)) {
      return;
    }

    const isOwner = resourceUserId === requestingUserId;
    if (isOwner) {
      if (!userPermissions.includes(ownPermission)) {
        throw new ForbiddenException(
          `You do not have the '${ownPermission}' permission to action on your own resource`,
        );
      }
    } else {
      throw new ForbiddenException(
        `You do not have the '${anyPermission}' permission to action on other people's resources`,
      );
    }
  }
}
