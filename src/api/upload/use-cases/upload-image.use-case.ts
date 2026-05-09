import { Injectable, Inject } from '@nestjs/common';
import { IUploadRepository } from '../domain/upload.repository.interface';
import { CloudinaryService } from '../cloudinary.service';
import { StorageService } from '../storage.service';

@Injectable()
export class UploadImageUseCase {
  private storageService: StorageService;

  constructor(
    @Inject(IUploadRepository)
    private readonly uploadRepository: IUploadRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    this.storageService = this.cloudinaryService;
  }

  verifyImage(file: Express.Multer.File) {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (file.size > maxSize) {
      throw new Error('Image size exceeds 5MB');
    }
    if (!allowedTypes.includes(file.mimetype)) {
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
