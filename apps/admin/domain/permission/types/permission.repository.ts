import type {
  IApiResponse,
  ICreateRoleRequest,
  IPermissionListResponse,
  IRoleListResponse,
  IRoleResponse,
} from "@ecommerce/shared";

import type { ApiListResponse } from "@/utils/request";

import type { TAdminPermission, TAdminRole } from "./permission.model";

export interface IAdminPermissionRepository {
  getRoles(page?: number, limit?: number): Promise<ApiListResponse<TAdminRole>>;
  getPermissions(
    page?: number,
    limit?: number,
  ): Promise<ApiListResponse<TAdminPermission>>;
  createRole(data: ICreateRoleRequest): Promise<IApiResponse<IRoleResponse>>;
  updateRolePermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<IApiResponse<IRoleResponse>>;
}

export type TRolesApiResponse = IApiResponse<IRoleListResponse>;
export type TPermissionsApiResponse = IApiResponse<IPermissionListResponse>;
