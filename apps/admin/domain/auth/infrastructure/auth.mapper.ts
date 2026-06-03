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
          description: dto.role.description || null,
          permissions: dto.role.permissions
            ? dto.role.permissions.map((item) => ({
                permission: {
                  id: item.permission.id,
                  permissionName: item.permission.permission_name,
                  description: item.permission.description,
                },
              }))
            : [],
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
      firstName: dto.first_name || "",
      lastName: dto.last_name || "",
      email: dto.email,
      dateOfBirth: dto.date_of_birth
        ? new Date(dto.date_of_birth).toISOString()
        : null,
      gender: dto.gender ?? null,
      avatarId: dto.avatar_id ?? null,
      createdAt: dto.created_at ? new Date(dto.created_at).toISOString() : "",
      updatedAt: dto.updated_at ? new Date(dto.updated_at).toISOString() : "",
      deletedAt: dto.deleted_at ? new Date(dto.deleted_at).toISOString() : null,
      roleId: dto.role_id ?? "",
      role,
      avatar: dto.avatar
        ? {
            id: dto.avatar.id,
            url: dto.avatar.url,
            width: dto.avatar.width,
            height: dto.avatar.height,
            format: dto.avatar.format,
          }
        : null,
      phones:
        dto.phones?.map((phone) => ({
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
        })) ?? [],
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
