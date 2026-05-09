import { IImage } from './image.entity';
import { Prisma } from 'generated/prisma/client';

export interface IUploadRepository {
  createImage(data: Prisma.ImageCreateInput): Promise<IImage>;
}

export const IUploadRepository = Symbol('IUploadRepository');
