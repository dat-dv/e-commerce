import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { AuthModule } from '../auth/auth.module';
import { UploadModule } from '../upload/upload.module';
import { IPostsRepository } from './domain/posts.repository.interface';
import { PostsRepository } from './infrastructure/posts.repository';
import { CreatePostUseCase } from './use-cases/create-post.use-case';
import { FindAllPostsUseCase } from './use-cases/find-all-posts.use-case';
import { FindOnePostUseCase } from './use-cases/find-one-post.use-case';
import { UpdatePostUseCase } from './use-cases/update-post.use-case';
import { RemovePostUseCase } from './use-cases/remove-post.use-case';

@Module({
  imports: [AuthModule, UploadModule],
  controllers: [PostsController],
  providers: [
    CreatePostUseCase,
    FindAllPostsUseCase,
    FindOnePostUseCase,
    UpdatePostUseCase,
    RemovePostUseCase,
    {
      provide: IPostsRepository,
      useClass: PostsRepository,
    },
  ],
  exports: [IPostsRepository],
})
export class PostsModule {}
