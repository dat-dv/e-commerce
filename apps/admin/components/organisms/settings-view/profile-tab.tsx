import { Avatar } from "@ecommerce/ui";

import { type IAdminUser } from "@/domain/user";

interface IProfileTabProps {
  user: IAdminUser | null;
}

export const ProfileTab = ({ user }: IProfileTabProps) => {
  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const userEmail = user?.email;
  const userAvatar = user?.avatarUrl || undefined;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[var(--app-text)]">
          Account Profile
        </h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Manage personal parameters and authorization roles.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-xl border border-white/[0.04] bg-white/1 p-4 sm:flex-row">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 ring-4 ring-white/10">
          <Avatar name={userName} url={userAvatar} size={64} />
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-[var(--app-text)]">
            {userName}
          </h4>
          <p className="text-xs text-[var(--muted)]">{userEmail}</p>
          <span className="inline-block rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">
            Admin Access
          </span>
        </div>
      </div>

      {/* Readonly info fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold tracking-wider text-[var(--muted)] uppercase">
            First Name
          </label>
          <input
            type="text"
            disabled
            value={user?.firstName || ""}
            className="w-full cursor-not-allowed rounded-lg border border-[var(--border-color)] bg-white/2 px-3.5 py-2 text-sm text-[var(--app-text)] opacity-70"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold tracking-wider text-[var(--muted)] uppercase">
            Last Name
          </label>
          <input
            type="text"
            disabled
            value={user?.lastName || ""}
            className="w-full cursor-not-allowed rounded-lg border border-[var(--border-color)] bg-white/2 px-3.5 py-2 text-sm text-[var(--app-text)] opacity-70"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold tracking-wider text-[var(--muted)] uppercase">
            Email Address
          </label>
          <input
            type="email"
            disabled
            value={userEmail || ""}
            className="w-full cursor-not-allowed rounded-lg border border-[var(--border-color)] bg-white/2 px-3.5 py-2 text-sm text-[var(--app-text)] opacity-70"
          />
        </div>
      </div>
    </div>
  );
};

ProfileTab.displayName = "ProfileTab";
