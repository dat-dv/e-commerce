import { IUserPhone } from "@ecommerce/shared";

export interface TAuthRequest {
  email: string;
  password: string;
}

export interface TRegisterRequest extends TAuthRequest {
  confirmPassword: string;
}

export interface TResetPasswordRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}

export enum EGender {
  MALE = 0,
  FEMALE = 1,
  OTHER = 2,
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
  avatar_url?: string | null;
  gender?: EGender | null;
  phone?: IUserPhone;
}

export interface TAuthState {
  user: TUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
