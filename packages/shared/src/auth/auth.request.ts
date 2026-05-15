/**
 * Authentication Request Interfaces (Synced with Backend DTOs)
 */

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  confirm_password: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface IChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface IVerifyPhoneRequest {
  token: string;
  phone_number: string;
  phone_code: string;
}
