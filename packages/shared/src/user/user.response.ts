import type { User, Role, Image, UserPhone, UserAvatar } from "../generate/browser";
import type { IPaginatedResult } from "../paginate";

export interface IUserResponse extends User {
  role?: Role | null;
  avatar?: Image | null;
  active_phone?: UserPhone | null;
  phones?: UserPhone[];
}

export type IUserProfileResponse = Omit<IUserResponse, "password">;

export interface IUpdateProfileResponse {
  success: boolean;
  user: IUserProfileResponse;
}

export type IGetUsersResponse = IPaginatedResult<IUserProfileResponse>;

export interface IUserAvatarResponse {
  id: UserAvatar["id"];
  image_id: UserAvatar["image_id"];
  url: Image["url"];
  width: Image["width"];
  height: Image["height"];
  format: Image["format"];
  is_current: boolean;
  created_at: UserAvatar["created_at"];
}
