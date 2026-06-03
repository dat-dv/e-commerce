export interface IAdminImage {
  id: string;
  url: string;
  publicId?: string | null;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  bytes?: number | null;
  createdAt?: string;
  updatedAt?: string;
}
