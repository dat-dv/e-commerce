import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import ConfigModule from './config/config.module';

@Module({
  imports: [ConfigModule, SharedModule, PostsModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
