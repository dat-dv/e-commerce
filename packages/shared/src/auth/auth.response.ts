import type { RefreshToken } from "../generate/browser";
import { IUserProfileResponse } from "../user/user.response";

export type ILoginResponse = IUserProfileResponse;
export type IRegisterResponse = IUserProfileResponse;
export type IAuthMeResponse = IUserProfileResponse;

export type IRefreshTokenResponse = RefreshToken;
