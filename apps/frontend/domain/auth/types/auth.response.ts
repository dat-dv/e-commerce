export interface IAppUserResponse {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  date_of_birth?: string | null;
  avatar_id?: string | null;
  password?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  role_id?: string | null;
}

export interface IAppUpdateUserRequest {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  date_of_birth?: string | null;
  avatar_id?: string | null;
  password?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  role_id?: string | null;
}
