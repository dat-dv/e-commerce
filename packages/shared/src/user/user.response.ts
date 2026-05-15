import { User, IPaginatedResult } from "../index";

export type IUserProfileResponse = User;

export interface IUpdateProfileResponse {
  success: boolean;
  user: User;
}

export type IGetUsersResponse = IPaginatedResult<User>;
