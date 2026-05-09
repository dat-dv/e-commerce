import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { CreateCommentUseCase } from './use-cases/create-comment.use-case';
import { GetCommentsByPostUseCase } from './use-cases/get-comments-by-post.use-case';
import { GetRepliesUseCase } from './use-cases/get-replies.use-case';
import { UpdateCommentUseCase } from './use-cases/update-comment.use-case';
import { RemoveCommentUseCase } from './use-cases/remove-comment.use-case';
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
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly getCommentsByPostUseCase: GetCommentsByPostUseCase,
    private readonly getRepliesUseCase: GetRepliesUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly removeCommentUseCase: RemoveCommentUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('CREATE:COMMENT')
  async create(@Req() req: Express.Request, @Param('postId') postId: string, @Body() dto: CreateCommentDto) {
    const res = await this.createCommentUseCase.execute(req.user.sub, postId, dto.content, dto.parent_id);
    return createSuccessResponse(res);
  }

  @Get()
  async getComments(@Param('postId') postId: string, @Query() query: GetCommentsDto) {
    const res = await this.getCommentsByPostUseCase.execute(postId, query.page, query.limit);
    return createSuccessResponse(res);
  }

  @Get(':commentId/replies')
  async getReplies(@Param('commentId') commentId: string, @Query() query: GetRepliesDto) {
    const res = await this.getRepliesUseCase.execute(commentId, query.page, query.limit);
    return createSuccessResponse(res);
  }

  @Patch(':commentId')
  @UseGuards(AuthGuard)
  async update(@Req() req: Express.Request, @Param('commentId') commentId: string, @Body() dto: UpdateCommentDto) {
    const res = await this.updateCommentUseCase.execute(commentId, req.user.sub, dto.content);
    return createSuccessResponse(res);
  }

  @Delete(':commentId')
  @UseGuards(AuthGuard)
  async remove(@Req() req: Express.Request, @Param('commentId') commentId: string) {
    const res = await this.removeCommentUseCase.execute(commentId, req.user.sub);
    return createSuccessResponse(res);
  }
}
