import { ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/molecules/page-header";

import type { IPermissionsHeaderProps } from "./permissions-view.types";

export const PermissionsHeader = ({
  roleCount,
  permissionCount,
  title = "Role Settings",
  description = "Create roles and manage the permissions each role owns.",
}: IPermissionsHeaderProps) => (
  <PageHeader title={title} description={description}>
    <div className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--muted)] shadow-sm">
      <ShieldCheck className="text-primary h-4 w-4" />
      <span>
        {roleCount} roles · {permissionCount} permissions
      </span>
    </div>
  </PageHeader>
);

PermissionsHeader.displayName = "PermissionsHeader";
