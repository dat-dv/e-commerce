"use client";

import { Button, Checkbox } from "@ecommerce/ui";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/molecules/page-header";
import { APP_ROUTES } from "@/constants/routes";
import { useCreateRoleView } from "@/hooks/role/use-create-role";

export const CreateRoleView = () => {
  const {
    newRoleName,
    newRoleDescription,
    newRolePermissionIds,
    loading,
    creatingRole,
    groupedPermissions,
    toggleNewRolePermission,
    handleCreateRole,
    setNewRoleName,
    setNewRoleDescription,
    router,
  } = useCreateRoleView();

  if (loading) {
    return (
      <div className="p-8 text-center text-[var(--muted)]">
        Loading permissions...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Role"
        description="Define a new role and grant it specific permissions."
        backAction={() => router.push(APP_ROUTES.PERMISSIONS)}
        backLabel="Back to roles"
      />

      <section className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-xl backdrop-blur-xl">
        <div className="border-b border-[var(--border-color)] p-5">
          <h2 className="text-lg font-bold text-[var(--app-text)]">
            Role Details
          </h2>
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
                value={newRoleName}
                onChange={(event) => setNewRoleName(event.target.value)}
                placeholder="ORDER_MANAGER"
                className="focus:border-primary h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 text-sm font-semibold text-[var(--app-text)] outline-none"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
                Description
              </span>
              <input
                value={newRoleDescription}
                onChange={(event) => setNewRoleDescription(event.target.value)}
                placeholder="Can manage orders and returns"
                className="focus:border-primary h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 text-sm text-[var(--app-text)] outline-none"
              />
            </label>
          </div>

          <div className="space-y-4 border-t border-[var(--border-color)] pt-4">
            <h3 className="font-bold text-[var(--app-text)]">Permissions</h3>
            {Object.entries(groupedPermissions).map(
              ([category, categoryPermissions]) => (
                <div key={category} className="mt-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h4 className="text-sm font-bold tracking-wide text-[var(--app-text)] uppercase">
                      {category}
                    </h4>
                    <span className="text-xs text-[var(--muted)]">
                      {
                        categoryPermissions.filter((permission) =>
                          newRolePermissionIds.includes(permission.id),
                        ).length
                      }
                      /{categoryPermissions.length}
                    </span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {categoryPermissions.map((permission) => (
                      <Checkbox
                        key={permission.id}
                        checked={newRolePermissionIds.includes(permission.id)}
                        onCheckedChange={() =>
                          toggleNewRolePermission(permission.id)
                        }
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

          <div className="flex items-center justify-end pt-4">
            <Button
              onClick={handleCreateRole}
              disabled={!newRoleName.trim() || creatingRole}
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {creatingRole ? "Creating..." : "Create Role"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

CreateRoleView.displayName = "CreateRoleView";
