import { Logger } from '@nestjs/common';
import { IImageResponse, IUploadResponse } from '@ecommerce/shared';

export abstract class StorageService {
  protected readonly logger = new Logger(this.constructor.name);

  abstract uploadImage(file: Express.Multer.File, location: string): Promise<IUploadResponse>;

  abstract deleteImage(publicId: string): Promise<boolean>;
}
