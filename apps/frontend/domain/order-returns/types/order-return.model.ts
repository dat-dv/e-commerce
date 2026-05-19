import { EOrderReturnStatus } from "@ecommerce/shared";

export interface TCreateOrderReturnInput {
  orderId: string;
  title: string;
  description?: string;
  imageIds?: string[];
}

export interface TUploadOrderReturnImageResponse {
  id: string;
  url: string;
  publicId: string | null;
}

export interface TOrderReturnImage {
  id: string;
  imageId: string;
  url?: string;
  publicId?: string | null;
}

export interface TOrderReturn {
  id: string;
  orderId: string;
  title: string;
  description: string | null;
  status: EOrderReturnStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  images: TOrderReturnImage[];
}
