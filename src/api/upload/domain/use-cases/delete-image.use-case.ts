import { Injectable } from '@nestjs/common';
import { StorageService } from '../../storage.service';

@Injectable()
export class DeleteImageUseCase {
  constructor(private readonly storageService: StorageService) {}

  async execute(publicId: string): Promise<boolean> {
    return this.storageService.deleteImage(publicId);
  }
}
