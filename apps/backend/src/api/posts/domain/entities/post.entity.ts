import { IPostStatus } from 'generated/prisma/client';

export interface IPost {
  id: string;
  title: string;
  slug: string;
  content: any; // Prisma.JsonValue
  thumbnail_id?: string | null;
  status: IPostStatus;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
