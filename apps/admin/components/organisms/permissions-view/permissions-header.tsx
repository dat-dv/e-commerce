import { Button } from "@ecommerce/ui";
import { Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/molecules/page-header";
import { APP_ROUTES } from "@/constants/routes";

import type { IPermissionsHeaderProps } from "./permissions-view.types";

export const PermissionsHeader = ({
  roleCount,
  permissionCount,
  title = "Role Settings",
  description = "Create roles and manage the permissions each role owns.",
}: IPermissionsHeaderProps) => (
  <PageHeader title={title} description={description}>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--muted)] shadow-sm">
        <ShieldCheck className="text-primary h-4 w-4" />
        <span>
          {roleCount} roles · {permissionCount} permissions
        </span>
      </div>
      <Button
        linkComponent={Link}
        href={APP_ROUTES.PERMISSIONS + "/create"}
        className="inline-flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Create Role
      </Button>
    </div>
  </PageHeader>
);

PermissionsHeader.displayName = "PermissionsHeader";
