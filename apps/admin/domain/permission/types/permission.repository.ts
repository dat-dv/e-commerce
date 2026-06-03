import type {
  IApiResponse,
  ICreateRoleRequest,
  IPermissionListResponse,
  IRoleListResponse,
  IRoleResponse,
} from "@ecommerce/shared";

import type {
  IAdminPermission,
  IAdminRole,
} from "@/domain/user/types/user.model";
import type { ApiListResponse } from "@/utils/request";

export interface IAdminPermissionRepository {
  getRoles(page?: number, limit?: number): Promise<ApiListResponse<IAdminRole>>;
  getPermissions(
    page?: number,
    limit?: number,
  ): Promise<ApiListResponse<IAdminPermission>>;
  createRole(data: ICreateRoleRequest): Promise<IApiResponse<IRoleResponse>>;
  updateRolePermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<IApiResponse<IRoleResponse>>;
}

export type TRolesApiResponse = IApiResponse<IRoleListResponse>;
export type TPermissionsApiResponse = IApiResponse<IPermissionListResponse>;
