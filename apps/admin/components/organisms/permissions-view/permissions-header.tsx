import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/molecules/page-header";
import { APP_ROUTES } from "@/constants/routes";

import type { IPermissionsHeaderProps } from "./permissions-view.types";

export const PermissionsHeader = ({
  permissionCount,
  title = "Role Permissions",
  description = "View and modify the permissions granted to this role.",
}: IPermissionsHeaderProps) => {
  const router = useRouter();

  return (
    <PageHeader
      title={title}
      description={description}
      backAction={() => router.push(APP_ROUTES.ROLES)}
      backLabel="Back to roles"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--muted)] shadow-sm">
          <ShieldCheck className="text-primary h-4 w-4" />
          <span>{permissionCount} permissions</span>
        </div>
      </div>
    </PageHeader>
  );
};

PermissionsHeader.displayName = "PermissionsHeader";
