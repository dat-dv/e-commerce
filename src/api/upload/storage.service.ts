import { Logger } from '@nestjs/common';
import { Image } from 'generated/prisma/client';

export abstract class StorageService {
  protected readonly logger = new Logger(this.constructor.name);

  abstract uploadImage(file: Express.Multer.File, location: string): Promise<Image>;
}
