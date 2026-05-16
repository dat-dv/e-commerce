import { TUser } from "@/domain/auth/types/auth.model";
import { ApiResponse } from "@/utils/request/request.types";
import { TUpdateUserInput } from "../types/user.model";

export interface IUsersRepository {
  updateProfile(user: TUpdateUserInput): Promise<ApiResponse<TUser>>;
  uploadAvatar(avatar: File, userId: string): Promise<ApiResponse<string>>;
}
