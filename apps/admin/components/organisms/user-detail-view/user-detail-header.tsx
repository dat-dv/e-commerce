import { Avatar } from "@ecommerce/ui";

import { PageHeader } from "@/components/molecules/page-header";

import type { IUserDetailHeaderProps } from "./user-detail-view.types";
import { getAdminUserDisplayName } from "./user-detail-view.utils";

export const UserDetailHeader = ({ user, onBack }: IUserDetailHeaderProps) => (
  <PageHeader
    title="User Detail"
    description="Read, update role, and remove a user account."
    backAction={onBack}
    backLabel="Back to customers"
  >
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
  </PageHeader>
);

UserDetailHeader.displayName = "UserDetailHeader";
