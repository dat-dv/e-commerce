import type { IPermissionResponse } from "@ecommerce/shared";

import type { TAdminRole } from "@/domain/permission";
import type { IAdminUser } from "@/domain/user";

export type PermissionsByCategory = Record<string, IPermissionResponse[]>;

export interface IPermissionsHeaderProps {
  roleCount: number;
  permissionCount: number;
}

export interface IPermissionsStatusAlertProps {
  error: string | null;
  successMessage: string | null;
}

export interface IRolePermissionsPanelProps {
  roles: TAdminRole[];
  selectedRole: TAdminRole | null;
  selectedRoleId: string;
  selectedPermissionIds: string[];
  groupedPermissions: PermissionsByCategory;
  savingPermissions: boolean;
  onRoleChange: (roleId: string) => void;
  onTogglePermission: (permissionId: string) => void;
  onSavePermissions: () => void;
}

export interface IAssignUserRolePanelProps {
  users: IAdminUser[];
  roles: TAdminRole[];
  userSearchQuery: string;
  selectedUserId: string;
  selectedAssignRoleId: string;
  assigningRole: boolean;
  onUserSearchChange: (query: string) => void;
  onUserChange: (userId: string) => void;
  onAssignRoleChange: (roleId: string) => void;
  onAssignRole: () => void;
}
