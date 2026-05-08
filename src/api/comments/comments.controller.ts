import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { CommentsService } from './comments.service';
import createSuccessResponse from 'src/common/respomse';
import { GetCommentsDto } from './dto/get-comments.dto';
import { GetRepliesDto } from './dto/get-replies.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { PermissionsGuard } from 'src/api/auth/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('CREATE:COMMENT')
  async create(@Req() req: Express.Request, @Param('postId') postId: string, @Body() dto: CreateCommentDto) {
    const res = await this.commentsService.createComment(req.user.sub, postId, dto.content, dto.parent_id);
    return createSuccessResponse(res);
  }

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

  @Patch(':commentId')
  @UseGuards(AuthGuard)
  async update(@Req() req: Express.Request, @Param('commentId') commentId: string, @Body() dto: UpdateCommentDto) {
    const res = await this.commentsService.update(commentId, req.user.sub, dto.content);
    return createSuccessResponse(res);
  }

  @Delete(':commentId')
  @UseGuards(AuthGuard)
  async remove(@Req() req: Express.Request, @Param('commentId') commentId: string) {
    const res = await this.commentsService.remove(commentId, req.user.sub);
    return createSuccessResponse(res);
  }
}
