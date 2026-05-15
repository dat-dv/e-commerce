import { User, Role, Image, ShippingAddress } from "../generate/browser";
import { IAddress, IUserPhone } from "./user.types";

export interface IUserProfileResponse extends User {
  role: Role | null;
  avatar: Image | null;
  default_phone: IUserPhone | null;
}

export type IUpdateUserResponse = IUserProfileResponse;

export interface IDeleteUserResponse {
  id: string;
  success: boolean;
}

export interface IGetUsersResponse {
  data: IUserProfileResponse[];
  total: number;
  page: number;
  limit: number;
}
