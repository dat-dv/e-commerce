import { Prisma } from 'generated/prisma/client';

export interface IUploadRepository {
  createImage(data: Prisma.ImageCreateInput): Promise<Prisma.ImageGetPayload<Record<string, never>>>;
}

export const IUploadRepository = Symbol('IUploadRepository');
