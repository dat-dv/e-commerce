import { type IUserProfileResponse } from "@ecommerce/shared";

import { type IAdminRole, type IAdminUser } from "@/domain/user";

export const AdminUserMapper = {
  toDomain(dto: IUserProfileResponse): IAdminUser {
    const role: IAdminRole | null = dto.role
      ? {
          id: dto.role.id,
          roleName: dto.role.role_name,
          description: dto.role.description || null,
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
      avatar: dto.avatar,
      avatarUrl: dto.avatar?.url ?? null,
      phones: dto.phones,
    };
  },
};
