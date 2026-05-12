import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { PostsModule } from './api/posts/posts.module';
import { UsersModule } from './api/users/users.module';
import { AuthModule } from './api/auth/auth.module';
import { TagsModule } from './api/tags/tags.module';
import { CommentsModule } from './api/comments/comments.module';
import { RolesModule } from './api/roles/roles.module';
import { PermissionsModule } from './api/permissions/permissions.module';
import ConfigModule from './config/config.module';
import { UploadModule } from './api/upload/upload.module';
import { ProductsModule } from './api/products/products.module';

@Module({
  imports: [
    ConfigModule,
    SharedModule,
    PostsModule,
    UsersModule,
    AuthModule,
    TagsModule,
    CommentsModule,
    RolesModule,
    PermissionsModule,
    UploadModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
