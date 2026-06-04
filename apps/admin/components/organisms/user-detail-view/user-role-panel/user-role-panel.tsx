import { Button, Select } from "@ecommerce/ui";
import { Save } from "lucide-react";

import type { IUserRolePanelProps } from "@/components/organisms/user-detail-view/user-detail-view.types";

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
      <Select
        label="Role"
        aria-label="User role"
        placeholder="Select role"
        selectedKey={selectedRoleId || undefined}
        onSelectionChange={(key) => onRoleChange(String(key))}
        options={roles.map((role) => ({
          label: role.roleName,
          value: role.id,
        }))}
      />

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
