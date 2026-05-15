import { IUserProfileResponse } from "../user";

export type ILoginResponse = IUserProfileResponse;
export type IRegisterResponse = IUserProfileResponse;

export interface IForgotPasswordResponse {
  message: string;
}

export interface IResetPasswordResponse {
  message: string;
}

export interface IVerifyPhoneResponse {
  message: string;
}
