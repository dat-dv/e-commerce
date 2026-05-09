import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { AuthModule } from '../auth/auth.module';
import { ICommentsRepository } from './domain/comments.repository.interface';
import { CommentsRepository } from './infrastructure/comments.repository';
import { CreateCommentUseCase } from './use-cases/create-comment.use-case';
import { GetCommentsByPostUseCase } from './use-cases/get-comments-by-post.use-case';
import { GetRepliesUseCase } from './use-cases/get-replies.use-case';
import { UpdateCommentUseCase } from './use-cases/update-comment.use-case';
import { RemoveCommentUseCase } from './use-cases/remove-comment.use-case';

@Module({
  imports: [AuthModule],
  controllers: [CommentsController],
  providers: [
    CreateCommentUseCase,
    GetCommentsByPostUseCase,
    GetRepliesUseCase,
    UpdateCommentUseCase,
    RemoveCommentUseCase,
    {
      provide: ICommentsRepository,
      useClass: CommentsRepository,
    },
  ],
  exports: [ICommentsRepository],
})
export class CommentsModule {}
