export enum EPostStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export interface TPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail_id?: string | null;
  status: EPostStatus;
  user_id: string;
  created_at: string | Date;
  updated_at: string | Date;
  deleted_at?: string | Date | null;
}
