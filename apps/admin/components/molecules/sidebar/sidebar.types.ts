import React from "react";

import type { TAdminPermission } from "@/constants/permissions";

export interface ISidebarLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  permissions?: TAdminPermission[];
}
