import {
  EGender,
  IUpdateUserRequest,
  IUserResponse,
  UserPhone,
} from "@ecommerce/shared";
import { TUpdateUserInput } from "../../users/types/user.model";
import { TUser, TUserPhone } from "../types/auth.model";

const mapPhone = (
  phone: UserPhone,
  activePhoneId?: string | null,
): TUserPhone => ({
  id: phone.id,
  phoneNumber: phone.phone,
  phoneCode: phone.phone_code,
  isDefault: phone.id === activePhoneId,
  isVerified: phone.is_verified,
});

export const UserMapper = {
  toDomain(dto: IUserResponse): TUser {
    const activePhone = dto.active_phone
      ? mapPhone(dto.active_phone, dto.active_phone_id)
      : null;
    const phones = dto.phones?.map((phone) =>
      mapPhone(phone, dto.active_phone_id),
    );

    return {
      id: dto.id,
      firstName: dto.first_name || "",
      lastName: dto.last_name || "",
      email: dto.email,
      dateOfBirth: dto.date_of_birth
        ? new Date(dto.date_of_birth).toISOString()
        : "",
      avatarId: dto.avatar_id || "",
      avatarUrl: dto.avatar?.url ?? null,
      gender: (dto.gender as EGender) ?? null,
      activePhone,
      phones,
      password: dto.password,
      createdAt: dto.created_at ? new Date(dto.created_at).toISOString() : "",
      updatedAt: dto.updated_at ? new Date(dto.updated_at).toISOString() : "",
      deletedAt: dto.deleted_at ? new Date(dto.deleted_at).toISOString() : null,
      roleId: dto.role_id,
      roleName: dto.role?.role_name || null,
    };
  },

  toDTO(
    user: Partial<TUser> & { phoneNumber?: string; phoneCode?: string },
  ): IUpdateUserRequest {
    const dto: IUpdateUserRequest = {};
    if (user.firstName) dto.first_name = user.firstName;
    if (user.lastName) dto.last_name = user.lastName;
    if (user.dateOfBirth) {
      dto.date_of_birth = user.dateOfBirth;
    }
    if (user.avatarId) dto.avatar_id = user.avatarId;
    if (user.phoneNumber) dto.phone = user.phoneNumber;
    if (user.phoneCode) dto.phone_code = user.phoneCode;
    if (user.gender !== undefined && user.gender !== null)
      dto.gender = user.gender as number;
    return dto;
  },

  toUpdateDTO(input: TUpdateUserInput): IUpdateUserRequest {
    return {
      first_name: input.firstName,
      last_name: input.lastName,
      date_of_birth: input.dateOfBirth,
      gender: input.gender as number,
      avatar_id: input.avatarId,
      phone: input.phoneNumber,
      phone_code: input.phoneCode,
    };
  },
};
