import React, { type ElementType } from "react";

export interface IAvatarDropdownMenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  active?: boolean;
}

export interface IAvatarDropdownLabels {
  menuLabel?: string;
  fallbackUser?: string;
  noEmail?: string;
  signOut?: string;
}

export interface IAvatarDropdownProps {
  name: string;
  email: string;
  avatarUrl?: string;
  menuItems: IAvatarDropdownMenuItem[];
  labels?: IAvatarDropdownLabels;
  onClickLogout: () => void;
  linkComponent?: ElementType;
  className?: string;
  popoverClassName?: string;
}
