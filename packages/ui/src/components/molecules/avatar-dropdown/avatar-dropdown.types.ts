import { type ElementType } from "react";

export interface IAvatarDropdownMenuItem {
  label: string;
  href?: string;
  icon?: ElementType;
  onClick?: () => void;
}

export interface IAvatarDropdownLabels {
  signOut?: string;
}

export interface IAvatarDropdownProps {
  user?: { name?: string; email?: string; avatarUrl?: string };
  menuItems?: IAvatarDropdownMenuItem[];
  onSignOut?: () => void;
  linkComponent?: ElementType;
  labels?: IAvatarDropdownLabels;
  className?: string;
}
