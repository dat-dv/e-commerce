import { EGender } from "./user.types";

export interface ICreateUserRequest {
  email: string;
  password?: string;
  confirm_password?: string;
  first_name?: string;
  last_name?: string;
}

export interface IUpdateUserRequest {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: EGender;
  avatar_id?: string;
  phone?: string;
  phone_code?: string;
  role_id?: string;
  deleted_at?: Date;
}

export interface IGetUsersRequest {
  page?: number;
  limit?: number;
}

export interface IAddUserPhoneRequest {
  phone: string;
  phone_code: string;
  is_verified: boolean;
}
