import type { Role, Permission } from "../generate/browser";
import type { IPaginatedResult } from "../paginate";

export interface IRoleResponse extends Role {
  permissions?: {
    permission: Permission;
  }[];
}

export type IRoleListResponse = IPaginatedResult<IRoleResponse>;
