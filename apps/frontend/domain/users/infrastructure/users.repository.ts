import { API_ROUTES } from "@/constants/routes";
import { UserMapper } from "@/domain/auth/infrastructure/auth.mapper";
import { TUser } from "@/domain/auth/types/auth.model";
import { TRequest, ApiResponse } from "@/utils/request/request.types";
import { IUser } from "@ecommerce/shared";
import { IUsersRepository } from "../interface/users.repository";
import { TUpdateUserProfileInput } from "./user.model";

export class UsersRepository implements IUsersRepository {
  constructor(private request: TRequest) {}

  async updateProfile(
    data: TUpdateUserProfileInput,
  ): Promise<ApiResponse<TUser>> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      if (value instanceof Date) {
        formData.append(key, value.toISOString());
        return;
      }

      formData.append(key, String(value));
    });

    if (data.avatar instanceof File) {
      formData.append("image", data.avatar);
    }

    const response = await this.request.patch<IUser>(
      API_ROUTES.USERS.PROFILE,
      formData,
    );

    return {
      ...response,
      data: UserMapper.toDomain(response.data),
    };
  }

  async uploadAvatar(
    avatar: File,
    userId: string,
  ): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append("avatar", avatar);

    const response = await this.request.post<{
      avatar_url: string;
    }>(API_ROUTES.USERS.UPLOAD_AVATAR(userId), formData);

    return {
      ...response,
      data: response.data.avatar_url,
    };
  }
}
