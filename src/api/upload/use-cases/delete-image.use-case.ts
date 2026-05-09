import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary.service';
import { StorageService } from '../storage.service';

@Injectable()
export class DeleteImageUseCase {
  private storageService: StorageService;

  constructor(private readonly cloudinaryService: CloudinaryService) {
    this.storageService = this.cloudinaryService;
  }

  async execute(publicId: string): Promise<boolean> {
    return this.storageService.deleteImage(publicId);
  }
}
