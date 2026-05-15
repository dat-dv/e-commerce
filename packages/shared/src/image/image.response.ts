import type { Image } from "../generate/browser";

export type IImage = Image;
export type IImageResponse = Image;
export type IUploadResponse = Omit<IImageResponse, "id" | "created_at" | "updated_at">;
