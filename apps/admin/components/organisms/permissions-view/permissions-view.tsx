"use client";

import { PermissionsHeader } from "./permissions-header";
import { PermissionsStatusAlert } from "./permissions-status-alert";
import { RolePermissionsPanel } from "./role-permissions-panel";
import { usePermissionsView } from "./use-permissions-view";

export const PermissionsView = () => {
  const {
    permissions,
    selectedRoleId,
    selectedPermissionIds,
    savingPermissions,
    error,
    successMessage,
    selectedRole,
    groupedPermissions,
    togglePermission,
    handleSavePermissions,
  } = usePermissionsView();

  return (
    <div className="space-y-6">
      <PermissionsHeader permissionCount={permissions.length} />

      <PermissionsStatusAlert error={error} successMessage={successMessage} />

      <div className="w-full">
        <RolePermissionsPanel
          selectedRole={selectedRole}
          selectedRoleId={selectedRoleId}
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
