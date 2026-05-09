import { Injectable, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { IPostsRepository } from '../entities/posts.repository.interface';

@Injectable()
export class RemovePostUseCase {
  constructor(
    @Inject(IPostsRepository)
    private readonly postsRepository: IPostsRepository,
  ) {}

  async execute(id: string, requestingUserId: string) {
    const currentPost = await this.postsRepository.findById(id);
    if (!currentPost) {
      throw new BadRequestException('Post not found');
    }

    await this.checkOwnershipOrPermission(currentPost.user_id, requestingUserId, 'DELETE:OWN_POST', 'DELETE:ANY_POST');

    return this.postsRepository.delete(id);
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
