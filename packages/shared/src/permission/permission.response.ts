import type { Permission } from "../generate/browser";
import type { IPaginatedResult } from "../paginate";

export type IPermission = Permission;
export type IPermissionResponse = Permission;
export type IPermissionListResponse = IPaginatedResult<Permission>;
