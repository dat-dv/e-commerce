export interface IComment {
  comment_id: string;
  content: string;
  post_id: string;
  user_id: string;
  parent_id?: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
