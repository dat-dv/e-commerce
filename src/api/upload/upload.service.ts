import { Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { CloudinaryService } from './cloudinary.service';
import { StorageService, UploadImageResponse } from './storage.service';

@Injectable()
export class UploadService {
  private storageService: StorageService;

  constructor(
    private readonly firebaseService: FirebaseService,
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

  verifyVideo(file: Express.Multer.File) {
    const maxSize = 100 * 1024 * 1024;
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (file.size > maxSize) {
      throw new Error('Video size exceeds 100MB');
    }
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid video format');
    }
    return true;
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadImageResponse> {
    this.verifyImage(file);
    return await this.storageService.uploadImage(file, 'images');
  }
}
