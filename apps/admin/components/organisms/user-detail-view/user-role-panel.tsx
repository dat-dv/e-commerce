import { Button } from "@ecommerce/ui";
import { Save } from "lucide-react";

import type { IUserRolePanelProps } from "./user-detail-view.types";

export const UserRolePanel = ({
  roles,
  selectedRoleId,
  saving,
  onRoleChange,
  onSave,
}: IUserRolePanelProps) => (
  <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-xl backdrop-blur-xl">
    <div className="mb-5">
      <h2 className="text-lg font-bold text-[var(--app-text)]">Role</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Assign one role to control this user account permissions.
      </p>
    </div>

    <div className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
          Role
        </span>
        <select
          value={selectedRoleId}
          onChange={(event) => onRoleChange(event.target.value)}
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
        onClick={onSave}
        disabled={!selectedRoleId || saving}
        className="inline-flex w-full items-center justify-center gap-2"
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save Role"}
      </Button>
    </div>
  </section>
);

UserRolePanel.displayName = "UserRolePanel";
