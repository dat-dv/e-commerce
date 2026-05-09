import { Module, forwardRef } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { AuthModule } from '../auth/auth.module';
import { FirebaseService } from './firebase.service';
import { CloudinaryService } from './cloudinary.service';
import { StorageService } from './storage.service';
import { IUploadRepository } from './domain/upload.repository.interface';
import { UploadRepository } from './infrastructure/upload.repository';
import { UploadImageUseCase } from './use-cases/upload-image.use-case';
import { DeleteImageUseCase } from './use-cases/delete-image.use-case';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UploadController],
  providers: [
    UploadImageUseCase,
    DeleteImageUseCase,
    FirebaseService,
    CloudinaryService,
    {
      provide: IUploadRepository,
      useClass: UploadRepository,
    },
    {
      provide: StorageService,
      useClass: CloudinaryService,
    },
  ],
  exports: [IUploadRepository],
})
export class UploadModule {}
