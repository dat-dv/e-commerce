export interface IImage {
  id: string;
  url: string;
  public_id: string;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  bytes?: number | null;
  created_at: Date;
  updated_at: Date;
}
