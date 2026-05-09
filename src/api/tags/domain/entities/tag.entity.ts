export interface ITag {
  id: string;
  tag_name: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
