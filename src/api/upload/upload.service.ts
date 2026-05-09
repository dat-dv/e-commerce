import { Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { CloudinaryService } from './cloudinary.service';
import { StorageService } from './storage.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { Image } from 'generated/prisma/client';

@Injectable()
export class UploadService {
  private storageService: StorageService;

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly prisma: PrismaService,
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

  async uploadImage(file: Express.Multer.File): Promise<Image> {
    this.verifyImage(file);
    const res = await this.storageService.uploadImage(file, 'images');
    return await this.prisma.image.create({
      data: res,
    });
  }

  async deleteImage(publicId: string): Promise<boolean> {
    return await this.storageService.deleteImage(publicId);
  }
}
