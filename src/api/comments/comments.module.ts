import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { AuthModule } from '../auth/auth.module';
import { ICommentsRepository } from './domain/entities/comments.repository.interface';
import { CommentsRepository } from './domain/infrastructure/comments.repository';
import { CreateCommentUseCase } from './domain/use-cases/create-comment.use-case';
import { GetCommentsByPostUseCase } from './domain/use-cases/get-comments-by-post.use-case';
import { GetRepliesUseCase } from './domain/use-cases/get-replies.use-case';
import { UpdateCommentUseCase } from './domain/use-cases/update-comment.use-case';
import { RemoveCommentUseCase } from './domain/use-cases/remove-comment.use-case';

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
