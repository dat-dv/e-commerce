import { EGender } from "./user.types";

export interface ICreateUserRequest {
  email: string;
  password: string;
  confirm_password: string;
}

export interface IUpdateUserRequest {
  id: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  date_of_birth?: Date;
  gender?: EGender;
  avatar_url?: string;
  phone_number?: string;
  phone_code?: string;
}

export interface IGetUsersRequest {
  page?: number;
  limit?: number;
}

export interface IUpdateAvatarRequest {
  avatar: any; // Multipart file
}
