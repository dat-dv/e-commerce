import { ShieldCheck } from "lucide-react";

import type { IPermissionsHeaderProps } from "./permissions-view.types";

export const PermissionsHeader = ({
  roleCount,
  permissionCount,
  title = "Role Settings",
  description = "Create roles and manage the permissions each role owns.",
}: IPermissionsHeaderProps) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)] sm:text-3xl">
        {title}
      </h1>
      <p className="mt-1.5 text-sm text-[var(--muted)]">{description}</p>
    </div>

    <div className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--muted)] shadow-sm">
      <ShieldCheck className="text-primary h-4 w-4" />
      <span>
        {roleCount} roles · {permissionCount} permissions
      </span>
    </div>
  </div>
);

PermissionsHeader.displayName = "PermissionsHeader";
