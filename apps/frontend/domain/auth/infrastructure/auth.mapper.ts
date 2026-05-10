import { TUser } from "../types/auth.model";
import {
  IAppUpdateUserRequest,
  IAppUserResponse,
} from "../types/auth.response";

export const UserMapper = {
  toDomain(dto: IAppUserResponse): TUser {
    return {
      id: dto.id,
      first_name: dto.first_name || "",
      last_name: dto.last_name || "",
      email: dto.email,
      date_of_birth: dto.date_of_birth || "",
      avatar_id: dto.avatar_id || "",
      password: dto.password,
      created_at: dto.created_at,
      updated_at: dto.updated_at,
      deleted_at: dto.deleted_at,
      role_id: dto.role_id,
    };
  },
  toDTO(user: Partial<TUser>): Partial<IAppUpdateUserRequest> {
    const dto: Partial<IAppUpdateUserRequest> = {};
    if (user.id) dto.id = user.id;
    if (user.first_name) dto.first_name = user.first_name;
    if (user.last_name) dto.last_name = user.last_name;
    if (user.password) dto.password = user.password;
    if (user.date_of_birth) {
      dto.date_of_birth = user.date_of_birth;
    }
    if (user.avatar_id) dto.avatar_id = user.avatar_id;
    if (user.created_at) {
      dto.created_at = user.created_at;
    }
    if (user.updated_at) {
      dto.updated_at = user.updated_at;
    }
    if (user.deleted_at) {
      dto.deleted_at = user.deleted_at;
    }

    if (user.role_id) dto.role_id = user.role_id;
    return dto;
  },
};
