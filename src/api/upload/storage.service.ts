import { Logger } from '@nestjs/common';

export interface UploadImageResponse {
  url: string; // Link để hiển thị ảnh (Bắt buộc)
  publicId: string; // ID của ảnh trên Cloud (Cực kỳ quan trọng để Xóa/Cập nhật)
  width?: number; // Chiều rộng (Giúp Frontend tối ưu layout, chống giật CLS)
  height?: number; // Chiều cao
  format?: string; // Định dạng (png, jpg, webp)
  bytes?: number; // Dung lượng file
}

export abstract class StorageService {
  protected readonly logger = new Logger(this.constructor.name);

  abstract uploadImage(file: Express.Multer.File, location: string): Promise<UploadImageResponse>;
}
