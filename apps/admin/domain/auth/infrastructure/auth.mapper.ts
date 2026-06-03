import {
  type IUpdateUserRequest,
  type IUserAvatarResponse,
  type IUserProfileResponse,
} from "@ecommerce/shared";

import {
  type IAdminRole,
  type IAdminUpdateUserInput,
  type IAdminUser,
  type IAdminUserAvatar,
} from "@/domain/user";

export const AdminUserMapper = {
  toDomain(dto: IUserProfileResponse): IAdminUser {
    const role: IAdminRole | null = dto.role
      ? {
          id: dto.role.id,
          roleName: dto.role.role_name,
          description: dto.role.description,
          permissions: dto.role.permissions?.map((item) => ({
            permission: {
              id: item.permission.id,
              permissionName: item.permission.permission_name,
              description: item.permission.description,
              category: item.permission.category,
              createdAt: item.permission.created_at
                ? new Date(item.permission.created_at).toISOString()
                : "",
              updatedAt: item.permission.updated_at
                ? new Date(item.permission.updated_at).toISOString()
                : "",
            },
          })),
          createdAt: dto.role.created_at
            ? new Date(dto.role.created_at).toISOString()
            : "",
          updatedAt: dto.role.updated_at
            ? new Date(dto.role.updated_at).toISOString()
            : "",
        }
      : null;

    return {
      id: dto.id,
      firstName: dto.first_name,
      lastName: dto.last_name,
      email: dto.email,
      dateOfBirth: dto.date_of_birth
        ? new Date(dto.date_of_birth).toISOString()
        : null,
      gender: dto.gender ?? null,
      avatarId: dto.avatar_id ?? null,
      createdAt: dto.created_at ? new Date(dto.created_at).toISOString() : "",
      updatedAt: dto.updated_at ? new Date(dto.updated_at).toISOString() : "",
      deletedAt: dto.deleted_at ? new Date(dto.deleted_at).toISOString() : null,
      roleId: dto.role_id,
      activePhoneId: dto.active_phone_id,
      role,
      avatar: dto.avatar
        ? {
            id: dto.avatar.id,
            url: dto.avatar.url,
            publicId: dto.avatar.public_id,
            width: dto.avatar.width,
            height: dto.avatar.height,
            format: dto.avatar.format,
            bytes: dto.avatar.bytes,
            createdAt: dto.avatar.created_at
              ? new Date(dto.avatar.created_at).toISOString()
              : "",
            updatedAt: dto.avatar.updated_at
              ? new Date(dto.avatar.updated_at).toISOString()
              : "",
          }
        : null,
      activePhone: dto.active_phone
        ? {
            id: dto.active_phone.id,
            userId: dto.active_phone.user_id,
            phone: dto.active_phone.phone,
            phoneCode: dto.active_phone.phone_code,
            isVerified: dto.active_phone.is_verified,
            createdAt: dto.active_phone.created_at
              ? new Date(dto.active_phone.created_at).toISOString()
              : "",
            updatedAt: dto.active_phone.updated_at
              ? new Date(dto.active_phone.updated_at).toISOString()
              : "",
          }
        : dto.active_phone,
      phones: dto.phones?.map((phone) => ({
        id: phone.id,
        userId: phone.user_id,
        phone: phone.phone,
        phoneCode: phone.phone_code,
        isVerified: phone.is_verified,
        createdAt: phone.created_at
          ? new Date(phone.created_at).toISOString()
          : "",
        updatedAt: phone.updated_at
          ? new Date(phone.updated_at).toISOString()
          : "",
      })),
    };
  },

  avatarToDomain(dto: IUserAvatarResponse): IAdminUserAvatar {
    return {
      id: dto.id,
      imageId: dto.image_id,
      url: dto.url,
      width: dto.width,
      height: dto.height,
      format: dto.format,
      isCurrent: dto.is_current,
      createdAt: dto.created_at ? new Date(dto.created_at).toISOString() : "",
    };
  },

  toUpdateDto(input: IAdminUpdateUserInput): IUpdateUserRequest {
    return {
      first_name: input.firstName,
      last_name: input.lastName,
      date_of_birth: input.dateOfBirth || undefined,
      gender: input.gender,
      avatar_id: input.avatarId,
      role_id: input.roleId,
    };
  },
};
