import { Button, Checkbox } from "@ecommerce/ui";
import { Save } from "lucide-react";

import type { IRolePermissionsPanelProps } from "./permissions-view.types";

export const RolePermissionsPanel = ({
  roles,
  selectedRole,
  selectedRoleId,
  selectedPermissionIds,
  groupedPermissions,
  savingPermissions,
  onRoleChange,
  onTogglePermission,
  onSavePermissions,
}: IRolePermissionsPanelProps) => {
  const selectedCount = selectedPermissionIds.length;

  return (
    <section className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-xl backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-[var(--border-color)] p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--app-text)]">
            Role Permissions
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Select a role, then choose the exact permissions it owns.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={selectedRoleId}
            onChange={(event) => onRoleChange(event.target.value)}
            className="focus:border-primary h-10 min-w-48 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 text-sm font-semibold text-[var(--app-text)] outline-none"
          >
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role_name}
              </option>
            ))}
          </select>

          <Button
            onClick={onSavePermissions}
            disabled={!selectedRoleId || savingPermissions}
            className="inline-flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {savingPermissions ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="border-b border-[var(--border-color)] px-5 py-3 text-sm text-[var(--muted)]">
        <span className="font-semibold text-[var(--app-text)]">
          {selectedRole?.role_name ?? "No role"}
        </span>{" "}
        has {selectedCount} selected permissions.
      </div>

      <div className="divide-y divide-[var(--border-color)]">
        {Object.entries(groupedPermissions).map(
          ([category, categoryPermissions]) => (
            <div key={category} className="p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold tracking-wide text-[var(--app-text)] uppercase">
                  {category}
                </h3>
                <span className="text-xs text-[var(--muted)]">
                  {
                    categoryPermissions.filter((permission) =>
                      selectedPermissionIds.includes(permission.id),
                    ).length
                  }
                  /{categoryPermissions.length}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {categoryPermissions.map((permission) => (
                  <Checkbox
                    key={permission.id}
                    checked={selectedPermissionIds.includes(permission.id)}
                    onCheckedChange={() => onTogglePermission(permission.id)}
                    className="rounded-lg border border-[var(--border-color)] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-[var(--app-text)]">
                        {permission.permission_name}
                      </span>
                      {permission.description && (
                        <span className="mt-0.5 block text-xs text-[var(--muted)]">
                          {permission.description}
                        </span>
                      )}
                    </span>
                  </Checkbox>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
};

RolePermissionsPanel.displayName = "RolePermissionsPanel";
