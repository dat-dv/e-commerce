export interface IRole {
  role_id: string;
  role_name: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
}
