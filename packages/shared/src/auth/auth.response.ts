import { IUserProfileResponse } from "../user/user.response";

export type ILoginResponse = IUserProfileResponse;
export type IRegisterResponse = IUserProfileResponse;
export type IAuthMeResponse = IUserProfileResponse;

export type IRefreshTokenResponse = {
  user_id: string;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
};
