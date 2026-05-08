import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import createSuccessResponse from 'src/common/respomse';
import { GetCommentsDto } from './dto/get-comments.dto';
import { GetRepliesDto } from './dto/get-replies.dto';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async getComments(@Param('postId') postId: string, @Query() query: GetCommentsDto) {
    const res = await this.commentsService.getCommentsByPost(postId, query.page, query.limit);
    return createSuccessResponse(res);
  }

  @Get(':commentId/replies')
  async getReplies(@Param('commentId') commentId: string, @Query() query: GetRepliesDto) {
    const res = await this.commentsService.getReplies(commentId, query.page, query.limit);
    return createSuccessResponse(res);
  }
}
