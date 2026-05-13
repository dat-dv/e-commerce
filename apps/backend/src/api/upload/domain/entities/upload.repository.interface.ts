import { IImage } from '@ecommerce/shared';

export interface ImageCreateInput {
  url: string;
  public_id: string;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  bytes?: number | null;
}

export interface IImageRepository {
  saveImage(data: ImageCreateInput): Promise<IImage>;
}

export const IImageRepository = Symbol('IImageRepository');
