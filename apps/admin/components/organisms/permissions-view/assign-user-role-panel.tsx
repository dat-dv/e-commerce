import { Button, SearchInput } from "@ecommerce/ui";
import { UserCog } from "lucide-react";
import { useMemo } from "react";

import type { IAssignUserRolePanelProps } from "./permissions-view.types";
import { getUserDisplayName } from "./permissions-view.utils";

export const AssignUserRolePanel = ({
  users,
  roles,
  userSearchQuery,
  selectedUserId,
  selectedAssignRoleId,
  assigningRole,
  onUserSearchChange,
  onUserChange,
  onAssignRoleChange,
  onAssignRole,
}: IAssignUserRolePanelProps) => {
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery) return users;
    const query = userSearchQuery.toLowerCase();
    return users.filter((user) =>
      `${user.firstName} ${user.lastName} ${user.email}`
        .toLowerCase()
        .includes(query),
    );
  }, [users, userSearchQuery]);

  return (
    <section className="h-fit rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-xl backdrop-blur-xl xl:sticky xl:top-24">
      <div className="mb-5 flex items-start gap-3">
        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
          <UserCog className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--app-text)]">
            Assign User Role
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Change a user role without editing their profile details.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <SearchInput
          placeholder="Search user..."
          value={userSearchQuery}
          onSearch={onUserSearchChange}
          onChange={onUserSearchChange}
          showSubmitButton={false}
        />

        <label className="block space-y-1.5">
          <span className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
            User
          </span>
          <select
            value={selectedUserId}
            onChange={(event) => onUserChange(event.target.value)}
            className="focus:border-primary h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 text-sm text-[var(--app-text)] outline-none"
          >
            {filteredUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {getUserDisplayName(user)} · {user.email}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
            Role
          </span>
          <select
            value={selectedAssignRoleId}
            onChange={(event) => onAssignRoleChange(event.target.value)}
            className="focus:border-primary h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 text-sm text-[var(--app-text)] outline-none"
          >
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </label>

        <Button
          onClick={onAssignRole}
          disabled={!selectedUserId || !selectedAssignRoleId || assigningRole}
          className="w-full"
        >
          {assigningRole ? "Assigning..." : "Assign Role"}
        </Button>
      </div>

      <div className="mt-6 space-y-2">
        <h3 className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
          Visible users
        </h3>
        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => {
                onUserChange(user.id);
                onAssignRoleChange(user.roleId || "");
              }}
              className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                selectedUserId === user.id
                  ? "border-primary bg-primary/10"
                  : "border-[var(--border-color)] bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
            >
              <span className="block text-sm font-semibold text-[var(--app-text)]">
                {getUserDisplayName(user)}
              </span>
              <span className="mt-0.5 block text-xs text-[var(--muted)]">
                {user.role?.roleName ?? "No role"} · {user.email}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

AssignUserRolePanel.displayName = "AssignUserRolePanel";
