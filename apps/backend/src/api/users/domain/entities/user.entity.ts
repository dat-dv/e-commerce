export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_id?: string | null;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
  role_id?: string | null;
}
