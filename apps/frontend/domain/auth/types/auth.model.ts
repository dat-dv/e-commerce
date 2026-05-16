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
  new_password: string;
  confirm_password: string;
}

export interface TUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  avatarId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  roleId?: string | null;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
  gender?: EGender | null;
  phones?: TUserPhone[];
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
