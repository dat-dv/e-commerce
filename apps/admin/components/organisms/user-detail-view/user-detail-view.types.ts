import type { TAdminRole } from "@/domain/permission";
import type { IAdminUser } from "@/domain/user";

export interface IUserDetailHeaderProps {
  user: IAdminUser | null;
  onBack: () => void;
}

export interface IUserProfilePanelProps {
  user: IAdminUser;
}

export interface IUserRolePanelProps {
  roles: TAdminRole[];
  selectedRoleId: string;
  saving: boolean;
  onRoleChange: (roleId: string) => void;
  onSave: () => void;
}

export interface IUserDangerZoneProps {
  deleting: boolean;
  onDelete: () => void;
}
