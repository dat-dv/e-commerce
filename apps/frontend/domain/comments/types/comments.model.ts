export interface TComment {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  parent_id?: string | null;
  created_at: string | Date;
  updated_at: string | Date;
  deleted_at?: string | Date | null;
}
