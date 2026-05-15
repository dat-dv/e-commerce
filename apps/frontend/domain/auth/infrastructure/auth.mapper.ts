import { TUser } from "../types/auth.model";
import { IUser } from "@ecommerce/shared";

export const UserMapper = {
  toDomain(dto: IUser): TUser {
    const defaultPhone =
      dto.phones?.find((p) => p.is_default) ?? dto.phones?.[0];

    return {
      id: dto.id,
      first_name: dto.first_name || "",
      last_name: dto.last_name || "",
      email: dto.email,
      date_of_birth: dto.date_of_birth
        ? new Date(dto.date_of_birth).toISOString()
        : "",
      avatar_id: dto.avatar_id || "",
      avatar_url: (dto as IUser & { avatar_url?: string }).avatar_url ?? null,
      phone_number: defaultPhone?.phone ?? null,
      gender: dto.gender ?? null,
      password: dto.password,
      created_at: dto.created_at ? new Date(dto.created_at).toISOString() : "",
      updated_at: dto.updated_at ? new Date(dto.updated_at).toISOString() : "",
      deleted_at: dto.deleted_at
        ? new Date(dto.deleted_at).toISOString()
        : null,
      role_id: dto.role_id,
    };
  },
  toDTO(user: Partial<TUser>): Partial<IUser> {
    const dto: Partial<IUser> = {};
    if (user.id) dto.id = user.id;
    if (user.first_name) dto.first_name = user.first_name;
    if (user.last_name) dto.last_name = user.last_name;
    if (user.date_of_birth) {
      dto.date_of_birth = new Date(user.date_of_birth);
    }
    if (user.avatar_id) dto.avatar_id = user.avatar_id;
    if (user.avatar_url !== undefined) dto.avatar_url = user.avatar_url | "";
    if (user.phone_number !== undefined) dto.phone_number = user.phone_number;
    if (user.gender !== undefined && user.gender !== null)
      dto.gender = user.gender;
    return dto;
  },
};
