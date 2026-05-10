export interface TImage {
  id: string;
  url: string;
  publicId: string;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  bytes?: number | null;
  created_at: string | Date;
  updated_at: string | Date;
}
