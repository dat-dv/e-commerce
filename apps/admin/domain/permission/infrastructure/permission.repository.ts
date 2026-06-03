import type {
  IApiResponse,
  ICreateRoleRequest,
  IRoleResponse,
} from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/utils/request/api-client";

import type {
  IAdminPermissionRepository,
  TPermissionsApiResponse,
  TRolesApiResponse,
} from "../types/permission.repository";
import { AdminPermissionMapper } from "./permission.mapper";

export class AdminPermissionRepository implements IAdminPermissionRepository {
  async getRoles(page = 1, limit = 100) {
    const response = await apiClient.get<TRolesApiResponse>(
      API_ROUTES.ROLES.LIST,
      {
        params: { page, limit },
      },
    );

    return {
      items: (response.data?.items ?? []).map(
        AdminPermissionMapper.roleToDomain,
      ),
      meta: response.data?.meta ?? {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }

  async getPermissions(page = 1, limit = 100) {
    const response = await apiClient.get<TPermissionsApiResponse>(
      API_ROUTES.PERMISSIONS.LIST,
      {
        params: { page, limit },
      },
    );

    return {
      items: (response.data?.items ?? []).map(
        AdminPermissionMapper.permissionToDomain,
      ),
      meta: response.data?.meta ?? {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }

  async createRole(data: ICreateRoleRequest) {
    return apiClient.post<IApiResponse<IRoleResponse>>(
      API_ROUTES.ROLES.CREATE,
      data,
    );
  }

  async updateRolePermissions(roleId: string, permissionIds: string[]) {
    return apiClient.patch<IApiResponse<IRoleResponse>>(
      API_ROUTES.ROLES.UPDATE(roleId),
      {
        permissions: permissionIds,
      },
    );
  }
}
