import { Calendar, Mail, Phone, Shield, User } from "lucide-react";

import type { IUserProfilePanelProps } from "@/components/organisms/user-detail-view/user-detail-view.types";
import {
  formatAdminDate,
  getAdminUserDisplayName,
  getGenderLabel,
} from "@/components/organisms/user-detail-view/user-detail-view.utils";

export const UserProfilePanel = ({ user }: IUserProfilePanelProps) => (
  <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-xl backdrop-blur-xl">
    <div className="mb-5">
      <h2 className="text-lg font-bold text-[var(--app-text)]">
        Profile Information
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Account fields synced from the user profile.
      </p>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-[var(--border-color)] bg-white/[0.02] p-4">
        <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
          <User className="h-4 w-4" />
          Name
        </div>
        <p className="text-sm font-semibold text-[var(--app-text)]">
          {getAdminUserDisplayName(user)}
        </p>
      </div>

      <div className="rounded-lg border border-[var(--border-color)] bg-white/[0.02] p-4">
        <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
          <Mail className="h-4 w-4" />
          Email
        </div>
        <p className="text-sm font-semibold text-[var(--app-text)]">
          {user.email}
        </p>
      </div>

      <div className="rounded-lg border border-[var(--border-color)] bg-white/[0.02] p-4">
        <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
          <Shield className="h-4 w-4" />
          Current Role
        </div>
        <p className="text-sm font-semibold text-[var(--app-text)]">
          {user.role?.roleName ?? "No role"}
        </p>
      </div>

      <div className="rounded-lg border border-[var(--border-color)] bg-white/[0.02] p-4">
        <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
          <User className="h-4 w-4" />
          Gender
        </div>
        <p className="text-sm font-semibold text-[var(--app-text)]">
          {getGenderLabel(user.gender)}
        </p>
      </div>

      <div className="rounded-lg border border-[var(--border-color)] bg-white/[0.02] p-4">
        <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
          <Calendar className="h-4 w-4" />
          Created
        </div>
        <p className="text-sm font-semibold text-[var(--app-text)]">
          {formatAdminDate(user.createdAt)}
        </p>
      </div>

      <div className="rounded-lg border border-[var(--border-color)] bg-white/[0.02] p-4">
        <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
          <Calendar className="h-4 w-4" />
          Updated
        </div>
        <p className="text-sm font-semibold text-[var(--app-text)]">
          {formatAdminDate(user.updatedAt)}
        </p>
      </div>
    </div>

    <div className="mt-4 rounded-lg border border-[var(--border-color)] bg-white/[0.02] p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
        <Phone className="h-4 w-4" />
        Phone Numbers
      </div>
      {user.phones && user.phones.length > 0 ? (
        <div className="space-y-1 text-sm text-[var(--app-text)]">
          {user.phones.map((phone) => (
            <p key={phone.id}>
              {phone.phoneCode}
              {phone.phone}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          No registered phone number
        </p>
      )}
    </div>
  </section>
);

UserProfilePanel.displayName = "UserProfilePanel";
