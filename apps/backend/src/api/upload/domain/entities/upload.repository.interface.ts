import { IImage } from './image.entity';

export interface ImageCreateInput {
  url: string;
  public_id?: string | null;
}

export interface IImageRepository {
  saveImage(data: ImageCreateInput): Promise<IImage>;
}

export const IImageRepository = Symbol('IImageRepository');
