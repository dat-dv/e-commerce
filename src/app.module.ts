import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { PostsModule } from './api/posts/posts.module';
import { UsersModule } from './api/users/users.module';
import { AuthModule } from './api/auth/auth.module';
import ConfigModule from './config/config.module';

@Module({
  imports: [ConfigModule, SharedModule, PostsModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
