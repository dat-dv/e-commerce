"use client";

import { CreateRolePanel } from "./create-role-panel";
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
    newRoleName,
    newRoleDescription,
    newRolePermissionIds,
    savingPermissions,
    creatingRole,
    error,
    successMessage,
    selectedRole,
    groupedPermissions,
    handleRoleChange,
    togglePermission,
    toggleNewRolePermission,
    handleCreateRole,
    handleSavePermissions,
    setNewRoleName,
    setNewRoleDescription,
  } = usePermissionsView();

  return (
    <div className="space-y-6">
      <PermissionsHeader
        roleCount={roles.length}
        permissionCount={permissions.length}
      />

      <PermissionsStatusAlert error={error} successMessage={successMessage} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
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

        <CreateRolePanel
          roleName={newRoleName}
          description={newRoleDescription}
          selectedPermissionIds={newRolePermissionIds}
          groupedPermissions={groupedPermissions}
          creatingRole={creatingRole}
          onRoleNameChange={setNewRoleName}
          onDescriptionChange={setNewRoleDescription}
          onTogglePermission={toggleNewRolePermission}
          onCreateRole={handleCreateRole}
        />
      </div>
    </div>
  );
};

PermissionsView.displayName = "PermissionsView";
