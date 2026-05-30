import { Avatar, Button } from "@ecommerce/ui";
import { ArrowLeft } from "lucide-react";

import type { IUserDetailHeaderProps } from "./user-detail-view.types";
import { getAdminUserDisplayName } from "./user-detail-view.utils";

export const UserDetailHeader = ({ user, onBack }: IUserDetailHeaderProps) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="rounded-lg text-[var(--app-text)] hover:bg-white/8"
        aria-label="Back to customers"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)] sm:text-3xl">
          User Detail
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Read, update role, and remove a user account.
        </p>
      </div>
    </div>

    {user && (
      <div className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3 shadow-sm">
        <Avatar
          name={getAdminUserDisplayName(user)}
          url={user.avatarUrl || undefined}
          size={40}
        />
        <div>
          <p className="text-sm font-semibold text-[var(--app-text)]">
            {getAdminUserDisplayName(user)}
          </p>
          <p className="text-xs text-[var(--muted)]">{user.email}</p>
        </div>
      </div>
    )}
  </div>
);

UserDetailHeader.displayName = "UserDetailHeader";
