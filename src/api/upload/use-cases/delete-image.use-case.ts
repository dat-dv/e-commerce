import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary.service';
import { StorageService } from '../storage.service';

@Injectable()
export class DeleteImageUseCase {
  constructor(private readonly storageService: StorageService) {}

  async execute(publicId: string): Promise<boolean> {
    return this.storageService.deleteImage(publicId);
  }
}
