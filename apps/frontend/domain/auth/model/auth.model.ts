export interface IAuthRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest extends IAuthRequest {
  fullName: string;
}

export interface TUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  avatar_id?: string | null;
  created_at?: string | Date;
  updated_at?: string | Date;
  deleted_at?: string | Date | null;
  role_id?: string | null;
}

export interface IAuthState {
  user: TUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
