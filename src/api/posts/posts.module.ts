import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
