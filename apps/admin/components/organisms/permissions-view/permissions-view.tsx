"use client";

import { PermissionsHeader } from "@/components/molecules/permissions-header";
import { RolePermissionsPanel } from "@/components/organisms/permissions-view/role-permissions-panel";
import { useRolePermissionsData } from "@/hooks/role/use-role-permissions-data";
import { useRolePermissionsMutations } from "@/hooks/role/use-role-permissions-mutations";

export const PermissionsView = () => {
  const { role, permissions, groupedPermissions, permissionRepository } =
    useRolePermissionsData();

  const {
    selectedPermissionIds,
    savingPermissions,
    togglePermission,
    handleSavePermissions,
  } = useRolePermissionsMutations(role, permissionRepository);

  return (
    <div className="space-y-6">
      <PermissionsHeader permissionCount={permissions.length} />

      <div className="w-full">
        <RolePermissionsPanel
          selectedRole={role}
          selectedRoleId={role?.id ?? ""}
          selectedPermissionIds={selectedPermissionIds}
          groupedPermissions={groupedPermissions}
          savingPermissions={savingPermissions}
          onTogglePermission={togglePermission}
          onSavePermissions={handleSavePermissions}
        />
      </div>
    </div>
  );
};

PermissionsView.displayName = "PermissionsView";
