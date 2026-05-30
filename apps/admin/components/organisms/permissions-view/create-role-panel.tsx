import { Button, Checkbox } from "@ecommerce/ui";
import { Plus } from "lucide-react";

import type { ICreateRolePanelProps } from "./permissions-view.types";

export const CreateRolePanel = ({
  roleName,
  description,
  selectedPermissionIds,
  groupedPermissions,
  creatingRole,
  onRoleNameChange,
  onDescriptionChange,
  onTogglePermission,
  onCreateRole,
}: ICreateRolePanelProps) => (
  <section className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-xl backdrop-blur-xl">
    <div className="border-b border-[var(--border-color)] p-5">
      <h2 className="text-lg font-bold text-[var(--app-text)]">Create Role</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Define a role name, description, and its initial permissions.
      </p>
    </div>

    <div className="space-y-5 p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
            Role name
          </span>
          <input
            value={roleName}
            onChange={(event) => onRoleNameChange(event.target.value)}
            placeholder="ORDER_MANAGER"
            className="focus:border-primary h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 text-sm font-semibold text-[var(--app-text)] outline-none"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
            Description
          </span>
          <input
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="Can manage orders and returns"
            className="focus:border-primary h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 text-sm text-[var(--app-text)] outline-none"
          />
        </label>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedPermissions).map(
          ([category, categoryPermissions]) => (
            <div key={category}>
              <div className="mb-3 flex items-center justify-between gap-3">
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

      <Button
        onClick={onCreateRole}
        disabled={!roleName.trim() || creatingRole}
        className="inline-flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        {creatingRole ? "Creating..." : "Create Role"}
      </Button>
    </div>
  </section>
);

CreateRolePanel.displayName = "CreateRolePanel";
