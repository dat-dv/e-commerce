export interface IAuthRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest extends IAuthRequest {
  confirmPassword: string;
}

export interface TUser {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  password?: string;
  avatar_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  role_id?: string | null;
  date_of_birth?: string | null;
}

export interface IAuthState {
  user: TUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
