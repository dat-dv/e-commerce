import { Injectable, Inject } from '@nestjs/common';
import { IUploadRepository } from '../entities/upload.repository.interface';
import { StorageService } from '../../storage.service';
import { UPLOAD_MAX_SIZE, UPLOAD_ALLOWED_TYPES } from 'src/common/constants/upload.constant';

@Injectable()
export class UploadImageUseCase {
  constructor(
    @Inject(IUploadRepository)
    private readonly uploadRepository: IUploadRepository,
    private readonly storageService: StorageService,
  ) {}

  verifyImage(file: Express.Multer.File) {
    if (file.size > UPLOAD_MAX_SIZE) {
      throw new Error('Image size exceeds 5MB');
    }
    if (!UPLOAD_ALLOWED_TYPES.includes(file.mimetype)) {
      throw new Error('Invalid image format');
    }
    return true;
  }

  async execute(file: Express.Multer.File) {
    this.verifyImage(file);
    const res = await this.storageService.uploadImage(file, 'images');
    return this.uploadRepository.createImage(res);
  }
}
