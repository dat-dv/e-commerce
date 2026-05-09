import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/api/auth/auth.module';
import { UploadModule } from 'src/api/upload/upload.module';

@Module({
  imports: [forwardRef(() => AuthModule), UploadModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
