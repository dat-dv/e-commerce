import { AdminPermissionRepository } from "../infrastructure/permission.repository";
import {
  AdminCreateRoleUseCase,
  AdminGetPermissionsUseCase,
  AdminGetRolesUseCase,
  AdminUpdateRolePermissionsUseCase,
} from "./permission.use-cases";

const repo = new AdminPermissionRepository();

export const adminPermissionUseCase = {
  getRoles: new AdminGetRolesUseCase(repo),
  getPermissions: new AdminGetPermissionsUseCase(repo),
  createRole: new AdminCreateRoleUseCase(repo),
  updateRolePermissions: new AdminUpdateRolePermissionsUseCase(repo),
};
