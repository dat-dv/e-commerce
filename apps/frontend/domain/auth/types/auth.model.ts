import { EGender } from "@ecommerce/shared";

export interface TAuthRequest {
  email: string;
  password: string;
}

export interface TRegisterRequest extends TAuthRequest {
  confirmPassword: string;
}

export interface TResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TForgotPasswordRequest {
  email?: string;
  phone?: string;
}

export interface TChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TUpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: EGender;
  avatarId?: string;
  phoneNumber?: string;
  phoneCode?: string;
}

export interface TUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  avatarId?: string | null;
  avatarHistory?: TUserAvatar[];
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  roleId?: string | null;
  roleName?: string | null;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
  gender?: EGender | null;
  phones?: TUserPhone[];
}

export interface TUserAvatar {
  id: string;
  url: string;
}

export interface TUserPhone {
  id: string;
  phoneNumber: string;
  phoneCode: string;
  isDefault: boolean;
}

export interface TAuthState {
  user: TUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
