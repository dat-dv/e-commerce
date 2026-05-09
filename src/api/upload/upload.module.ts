import { Module, forwardRef } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { AuthModule } from '../auth/auth.module';
import { FirebaseService } from './firebase.service';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UploadController],
  providers: [UploadService, FirebaseService, CloudinaryService],
  exports: [UploadService],
})
export class UploadModule {}
