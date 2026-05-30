"use client";

import type { IPermissionResponse } from "@ecommerce/shared";
import { BasicLoading } from "@ecommerce/ui";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  AdminPermissionRepository,
  type TAdminRole,
} from "@/domain/permission";
import { AdminUserRepository, type IAdminUser } from "@/domain/user";

import { AssignUserRolePanel } from "./assign-user-role-panel";
import { PermissionsHeader } from "./permissions-header";
import { PermissionsStatusAlert } from "./permissions-status-alert";
import {
  DEFAULT_PERMISSION_ERROR,
  getPermissionIds,
  groupPermissionsByCategory,
} from "./permissions-view.utils";
import { RolePermissionsPanel } from "./role-permissions-panel";

export const PermissionsView = () => {
  const permissionRepository = useMemo(
    () => new AdminPermissionRepository(),
    [],
  );
  const userRepository = useMemo(() => new AdminUserRepository(), []);

  const [roles, setRoles] = useState<TAdminRole[]>([]);
  const [permissions, setPermissions] = useState<IPermissionResponse[]>([]);
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedAssignRoleId, setSelectedAssignRoleId] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    [],
  );
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingPermissions, setSavingPermissions] = useState(false);
  const [assigningRole, setAssigningRole] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const roleById = useMemo(
    () => new Map(roles.map((role) => [role.id, role])),
    [roles],
  );

  const selectedRole = roleById.get(selectedRoleId) ?? null;

  const groupedPermissions = useMemo(
    () => groupPermissionsByCategory(permissions),
    [permissions],
  );

  const loadPermissionData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [rolesResponse, permissionsResponse, usersResponse] =
        await Promise.all([
          permissionRepository.getRoles(),
          permissionRepository.getPermissions(),
          userRepository.getUsers(1, 100),
        ]);

      const nextRoles = rolesResponse.items;
      setRoles(nextRoles);
      setPermissions(permissionsResponse.items);
      setUsers(usersResponse.items);

      const firstRole = nextRoles[0] ?? null;
      setSelectedRoleId(firstRole?.id ?? "");
      setSelectedPermissionIds(getPermissionIds(firstRole));
      setSelectedAssignRoleId(firstRole?.id ?? "");
      setSelectedUserId(usersResponse.items[0]?.id ?? "");
    } catch (err) {
      console.error(err);
      setError(DEFAULT_PERMISSION_ERROR);
    } finally {
      setLoading(false);
    }
  }, [permissionRepository, userRepository]);

  useEffect(() => {
    loadPermissionData();
  }, [loadPermissionData]);

  const handleRoleChange = (roleId: string) => {
    const nextRole = roleById.get(roleId) ?? null;
    setSelectedRoleId(roleId);
    setSelectedPermissionIds(getPermissionIds(nextRole));
    setSuccessMessage(null);
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId],
    );
    setSuccessMessage(null);
  };

  const handleSavePermissions = async () => {
    if (!selectedRoleId) return;

    setSavingPermissions(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await permissionRepository.updateRolePermissions(
        selectedRoleId,
        selectedPermissionIds,
      );
      const updatedRole = response.data;

      setRoles((current) =>
        current.map((role) =>
          role.id === updatedRole.id ? updatedRole : role,
        ),
      );
      setSuccessMessage("Role permissions updated.");
    } catch (err) {
      console.error(err);
      setError("Failed to update role permissions.");
    } finally {
      setSavingPermissions(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedAssignRoleId) return;

    setAssigningRole(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await permissionRepository.assignRoleToUser(
        selectedUserId,
        selectedAssignRoleId,
      );

      const assignedRole = roleById.get(selectedAssignRoleId) ?? null;
      setUsers((current) =>
        current.map((user) =>
          user.id === selectedUserId
            ? {
                ...user,
                roleId: selectedAssignRoleId,
                role: assignedRole
                  ? {
                      id: assignedRole.id,
                      roleName: assignedRole.role_name,
                      description: assignedRole.description,
                      createdAt: String(assignedRole.created_at),
                      updatedAt: String(assignedRole.updated_at),
                    }
                  : user.role,
              }
            : user,
        ),
      );
      setSuccessMessage("User role assigned.");
    } catch (err) {
      console.error(err);
      setError("Failed to assign role to user.");
    } finally {
      setAssigningRole(false);
    }
  };

  return (
    <>
      {loading && <BasicLoading isBlur={false} />}

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

          <AssignUserRolePanel
            users={users}
            roles={roles}
            userSearchQuery={userSearchQuery}
            selectedUserId={selectedUserId}
            selectedAssignRoleId={selectedAssignRoleId}
            assigningRole={assigningRole}
            onUserSearchChange={setUserSearchQuery}
            onUserChange={setSelectedUserId}
            onAssignRoleChange={setSelectedAssignRoleId}
            onAssignRole={handleAssignRole}
          />
        </div>
      </div>
    </>
  );
};

PermissionsView.displayName = "PermissionsView";
