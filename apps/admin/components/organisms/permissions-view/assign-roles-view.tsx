"use client";

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
import { DEFAULT_PERMISSION_ERROR } from "./permissions-view.utils";

export const AssignRolesView = () => {
  const permissionRepository = useMemo(
    () => new AdminPermissionRepository(),
    [],
  );
  const userRepository = useMemo(() => new AdminUserRepository(), []);

  const [roles, setRoles] = useState<TAdminRole[]>([]);
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedAssignRoleId, setSelectedAssignRoleId] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigningRole, setAssigningRole] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const roleById = useMemo(
    () => new Map(roles.map((role) => [role.id, role])),
    [roles],
  );

  const loadAssignRoleData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [rolesResponse, usersResponse] = await Promise.all([
        permissionRepository.getRoles(),
        userRepository.getUsers(1, 100),
      ]);

      const nextRoles = rolesResponse.items;
      setRoles(nextRoles);
      setUsers(usersResponse.items);
      setSelectedAssignRoleId(nextRoles[0]?.id ?? "");
      setSelectedUserId(usersResponse.items[0]?.id ?? "");
    } catch (err) {
      console.error(err);
      setError(DEFAULT_PERMISSION_ERROR);
    } finally {
      setLoading(false);
    }
  }, [permissionRepository, userRepository]);

  useEffect(() => {
    loadAssignRoleData();
  }, [loadAssignRoleData]);

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
          title="Assign Roles"
          description="Assign an existing role to a user account."
          roleCount={roles.length}
          permissionCount={users.length}
        />

        <PermissionsStatusAlert error={error} successMessage={successMessage} />

        <div className="max-w-xl">
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

AssignRolesView.displayName = "AssignRolesView";
