import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';
import type { Image } from 'generated/prisma/client';

@Injectable()
export class CloudinaryService extends StorageService {
  constructor(private readonly configService: ConfigService) {
    super();
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File, location: string): Promise<Image> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: location,
        },
        (error, result) => {
          if (error) {
            this.logger.error('Cloudinary upload failed', error);
            return reject(new Error('Cloudinary upload failed', { cause: error }));
          }
          if (!result) {
            this.logger.error('Cloudinary upload failed: No result');
            return reject(new Error('Cloudinary upload failed: No result'));
          }
          resolve({
            id: '',
            created_at: new Date(),
            updated_at: new Date(),
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          });
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}
