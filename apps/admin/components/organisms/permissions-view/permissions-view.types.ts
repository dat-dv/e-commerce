import type {
  IAdminPermission,
  IAdminRole,
} from "@/domain/user/types/user.model";

export type PermissionsByCategory = Record<string, IAdminPermission[]>;

export interface IPermissionsHeaderProps {
  permissionCount: number;
  title?: string;
  description?: string;
}

export interface IRolePermissionsPanelProps {
  selectedRole: IAdminRole | null;
  selectedRoleId: string;
  selectedPermissionIds: string[];
  groupedPermissions: PermissionsByCategory;
  savingPermissions: boolean;
  onTogglePermission: (permissionId: string) => void;
  onSavePermissions: () => void;
}

export interface ICreateRolePanelProps {
  roleName: string;
  description: string;
  selectedPermissionIds: string[];
  groupedPermissions: PermissionsByCategory;
  creatingRole: boolean;
  onRoleNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTogglePermission: (permissionId: string) => void;
  onCreateRole: () => void;
}
