import type { IPermissionResponse, IRoleResponse } from "@ecommerce/shared";

import type {
  IAdminPermission,
  IAdminRole,
} from "@/domain/user/types/user.model";

export class AdminPermissionMapper {
  static permissionToDomain(dto: IPermissionResponse): IAdminPermission {
    return {
      id: dto.id,
      permissionName: dto.permission_name,
      description: dto.description,
      category: dto.category,
      createdAt: dto.created_at?.toString(),
      updatedAt: dto.updated_at?.toString(),
    };
  }

  static roleToDomain(dto: IRoleResponse): IAdminRole {
    return {
      id: dto.id,
      roleName: dto.role_name,
      description: dto.description,
      createdAt: dto.created_at?.toString() ?? "",
      updatedAt: dto.updated_at?.toString() ?? "",
      permissions:
        dto.permissions?.map((p) => ({
          permission: AdminPermissionMapper.permissionToDomain(p.permission),
        })) ?? [],
    };
  }
}
