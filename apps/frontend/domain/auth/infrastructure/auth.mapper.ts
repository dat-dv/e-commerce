import { EGender, IUserResponse } from "@ecommerce/shared";
import { TUpdateUserInput } from "../../users/types/user.model";
import { TUser } from "../types/auth.model";

type TUpdateUserRequestDto = {
  first_name?: string;
  last_name?: string;
  password?: string;
  date_of_birth?: string;
  gender?: number;
  avatar_id?: string;
  phone_number?: string;
  phone_code?: string;
};

export const UserMapper = {
  toDomain(dto: IUserResponse): TUser {
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
      phones: dto.phones?.map((p) => ({
        id: p.id,
        phoneNumber: p.phone_number,
        phoneCode: p.phone_code,
        isDefault: p.is_default,
      })),
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
  ): Partial<IUserResponse> & { phone_number?: string; phone_code?: string } {
    const dto: Partial<IUserResponse> & {
      phone_number?: string;
      phone_code?: string;
    } = {};
    if (user.id) dto.id = user.id;
    if (user.firstName) dto.first_name = user.firstName;
    if (user.lastName) dto.last_name = user.lastName;
    if (user.dateOfBirth) {
      dto.date_of_birth = new Date(user.dateOfBirth);
    }
    if (user.avatarId) dto.avatar_id = user.avatarId;
    if (user.phoneNumber) dto.phone_number = user.phoneNumber;
    if (user.phoneCode) dto.phone_code = user.phoneCode;
    if (user.phones && user.phones.length > 0) {
      dto.phones = user.phones.map((p) => ({
        id: p.id,
        phone_number: p.phoneNumber,
        phone_code: p.phoneCode,
        is_default: p.isDefault,
        is_verified: true, // Default for mapping
        user_id: user.id || "",
        created_at: new Date(),
        updated_at: new Date(),
      }));
    }
    if (user.gender !== undefined && user.gender !== null)
      dto.gender = user.gender as number;
    return dto;
  },

  toUpdateDTO(input: TUpdateUserInput): TUpdateUserRequestDto {
    return {
      first_name: input.firstName,
      last_name: input.lastName,
      password: input.password,
      date_of_birth: input.dateOfBirth,
      gender: input.gender as number,
      avatar_id: input.avatarId,
      phone_number: input.phoneNumber,
      phone_code: input.phoneCode,
    };
  },
};
