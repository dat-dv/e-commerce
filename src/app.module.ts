import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import ConfigModule from './config/config.module';

@Module({
  imports: [ConfigModule, SharedModule, PostsModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
