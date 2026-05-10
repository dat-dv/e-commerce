export interface IUser {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  date_of_birth?: Date | null;
  avatar_id?: string | null;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
  role_id?: string | null;
}
