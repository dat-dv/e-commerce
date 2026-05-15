import { TUser } from "@/domain/auth/types/auth.model";
import { ApiResponse } from "@/utils/request/request.types";

export interface IUsersRepository {
  updateProfile(user: Partial<TUser>): Promise<ApiResponse<TUser>>;
  uploadAvatar(avatar: File, userId: string): Promise<ApiResponse<string>>;
}
