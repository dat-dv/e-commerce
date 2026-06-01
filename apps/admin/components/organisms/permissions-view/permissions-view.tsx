"use client";

import { PermissionsHeader } from "./permissions-header";
import { PermissionsStatusAlert } from "./permissions-status-alert";
import { RolePermissionsPanel } from "./role-permissions-panel";
import { usePermissionsView } from "./use-permissions-view";

export const PermissionsView = () => {
  const {
    roles,
    permissions,
    selectedRoleId,
    selectedPermissionIds,
    savingPermissions,
    error,
    successMessage,
    selectedRole,
    groupedPermissions,
    handleRoleChange,
    togglePermission,
    handleSavePermissions,
  } = usePermissionsView();

  return (
    <div className="space-y-6">
      <PermissionsHeader
        roleCount={roles.length}
        permissionCount={permissions.length}
      />

      <PermissionsStatusAlert error={error} successMessage={successMessage} />

      <div className="w-full">
        <RolePermissionsPanel
          roles={roles}
          selectedRole={selectedRole}
          selectedRoleId={selectedRoleId}
          selectedPermissionIds={selectedPermissionIds}
          groupedPermissions={groupedPermissions}
          savingPermissions={savingPermissions}
          onRoleChange={handleRoleChange}
          onTogglePermission={togglePermission}
          onSavePermissions={handleSavePermissions}
        />
      </div>
    </div>
  );
};

PermissionsView.displayName = "PermissionsView";
