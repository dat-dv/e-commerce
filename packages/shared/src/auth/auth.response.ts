import { IUserProfileResponse } from "../user/user.response";


export type ILoginResponse = Omit<IUserProfileResponse, 'password' | 'salt'>;
export type IRegisterResponse = Omit<IUserProfileResponse, 'password' | 'salt'>;
export type IAuthMeResponse = Omit<IUserProfileResponse, 'password' | 'salt'>;
