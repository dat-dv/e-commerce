import type { User, Role, Image, UserPhone } from "../generate/browser";
import type { IPaginatedResult } from "../paginate";

export interface IUserResponse extends User {
  role?: Role | null;
  avatar?: Image | null;
  phones?: UserPhone[];
}

export type IUserProfileResponse = Omit<IUserResponse, "password" | "salt">;

export interface IUpdateProfileResponse {
  success: boolean;
  user: IUserProfileResponse;
}

export type IGetUsersResponse = IPaginatedResult<IUserProfileResponse>;
