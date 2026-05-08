import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { PostsModule } from './posts/posts.module';
import ConfigModule from './config/config.module';

@Module({
  imports: [ConfigModule, SharedModule, PostsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
