import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { StorageService, UploadImageResponse } from './storage.service';

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

  /**
   * Uploads an image to Cloudinary.
   * @param file The image file to upload.
   * @param location The folder location in Cloudinary.
   * @returns The secure URL of the uploaded image.
   */
  async uploadImage(file: Express.Multer.File, location: string): Promise<UploadImageResponse> {
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

  /**
   * Uploads a video to Cloudinary.
   * @param file The video file to upload.
   * @param location The folder location in Cloudinary.
   * @returns The secure URL of the uploaded video.
   */
  async uploadVideo(file: Express.Multer.File, location: string): Promise<UploadVideoResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: location,
          resource_type: 'video', // Required for video uploads in Cloudinary
        },
        (error, result) => {
          if (error) {
            this.logger.error('Cloudinary video upload failed', error);
            return reject(new Error('Cloudinary video upload failed', { cause: error }));
          }
          if (!result) {
            this.logger.error('Cloudinary video upload failed: No result');
            return reject(new Error('Cloudinary video upload failed: No result'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            duration: result.duration as number,
            bytes: result.bytes,
          });
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  /**
   * Deletes an image from Cloudinary.
   * @param fileUrl The full URL of the image to delete.
   * @returns True if deleted successfully.
   */
  async deleteImage(fileUrl: string): Promise<boolean> {
    const publicId = this.getPublicIdFromUrl(fileUrl);
    if (!publicId) {
      throw new Error('Invalid Cloudinary URL');
    }
    try {
      const result = (await cloudinary.uploader.destroy(publicId)) as { result: string };
      return result.result === 'ok';
    } catch (error) {
      this.logger.error('Cloudinary delete failed', error);
      throw new Error('Cloudinary delete failed', { cause: error });
    }
  }

  /**
   * Deletes multiple images from Cloudinary.
   * @param fileUrls Array of full URLs of images to delete.
   * @returns True if operation completed.
   */
  async deleteMutipleImage(fileUrls: string[]): Promise<boolean> {
    const publicIds = fileUrls.map((url) => this.getPublicIdFromUrl(url)).filter(Boolean);
    if (publicIds.length === 0) {
      return false;
    }
    try {
      await cloudinary.api.delete_resources(publicIds);
      return true;
    } catch (error) {
      this.logger.error('Cloudinary batch delete failed', error);
      throw new Error('Cloudinary batch delete failed', { cause: error });
    }
  }

  /**
   * Extracts the public ID from a Cloudinary URL.
   * Why: Cloudinary API requires the public ID for deletion, not the full URL.
   * @param url The full Cloudinary URL.
   * @returns The public ID or empty string if not found.
   */
  private getPublicIdFromUrl(url: string): string {
    // Matches the part after /upload/v<numbers>/ and before the extension
    const regex = /\/upload\/(?:v\d+\/)?([^.]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }
}
