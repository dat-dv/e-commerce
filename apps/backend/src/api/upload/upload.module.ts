import { Module, forwardRef } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { AuthModule } from '../auth/auth.module';
import { FirebaseService } from './firebase-upload.service';
import { CloudinaryService } from './cloudinary-upload.service';
import { StorageService } from './storage.service';
import { IImageRepository } from './domain/entities/upload.repository.interface';
import { ImageRepository } from './domain/infrastructure/image.repository';
import { UploadImageUseCase } from './domain/use-cases/upload-image.use-case';
import { DeleteImageUseCase } from './domain/use-cases/delete-image.use-case';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UploadController],
  providers: [
    UploadImageUseCase,
    DeleteImageUseCase,
    FirebaseService,
    CloudinaryService,
    {
      provide: IImageRepository,
      useClass: ImageRepository,
    },
    {
      provide: StorageService,
      useClass: CloudinaryService,
    },
  ],
  exports: [IImageRepository, UploadImageUseCase, DeleteImageUseCase],
})
export class UploadModule {}
