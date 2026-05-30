export interface TAdminSignInRequest {
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface TAdminForgotPasswordRequest {
  email: string;
  [key: string]: unknown;
}
