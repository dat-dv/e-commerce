import type { IAdminRole, IAdminUser } from "@/domain/user/types/user.model";

export interface IUserDetailHeaderProps {
  user: IAdminUser | null;
  onBack: () => void;
}

export interface IUserProfilePanelProps {
  user: IAdminUser;
}

export interface IUserRolePanelProps {
  roles: IAdminRole[];
  selectedRoleId: string;
  saving: boolean;
  onRoleChange: (roleId: string) => void;
  onSave: () => void;
}

export interface IUserDangerZoneProps {
  deleting: boolean;
  onDelete: () => void;
}
