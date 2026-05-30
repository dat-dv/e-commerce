"use client";

import type { IPermissionResponse } from "@ecommerce/shared";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  AdminPermissionRepository,
  type TAdminRole,
} from "@/domain/permission";

import {
  DEFAULT_PERMISSION_ERROR,
  getPermissionIds,
  groupPermissionsByCategory,
} from "./permissions-view.utils";

export const usePermissionsView = () => {
  const permissionRepository = useMemo(
    () => new AdminPermissionRepository(),
    [],
  );

  const [roles, setRoles] = useState<TAdminRole[]>([]);
  const [permissions, setPermissions] = useState<IPermissionResponse[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    [],
  );
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newRolePermissionIds, setNewRolePermissionIds] = useState<string[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [savingPermissions, setSavingPermissions] = useState(false);
  const [creatingRole, setCreatingRole] = useState(false);
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
      const [rolesResponse, permissionsResponse] = await Promise.all([
        permissionRepository.getRoles(),
        permissionRepository.getPermissions(),
      ]);

      const nextRoles = rolesResponse.items;
      setRoles(nextRoles);
      setPermissions(permissionsResponse.items);

      const firstRole = nextRoles[0] ?? null;
      setSelectedRoleId(firstRole?.id ?? "");
      setSelectedPermissionIds(getPermissionIds(firstRole));
    } catch (err) {
      console.error(err);
      setError(DEFAULT_PERMISSION_ERROR);
    } finally {
      setLoading(false);
    }
  }, [permissionRepository]);

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

  const toggleNewRolePermission = (permissionId: string) => {
    setNewRolePermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId],
    );
    setSuccessMessage(null);
  };

  const handleCreateRole = async () => {
    const roleName = newRoleName.trim();
    if (!roleName) return;

    setCreatingRole(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await permissionRepository.createRole({
        role_name: roleName,
        description: newRoleDescription.trim() || undefined,
        permissions: newRolePermissionIds,
      });
      const createdRole = response.data;

      setRoles((current) => [createdRole, ...current]);
      setSelectedRoleId(createdRole.id);
      setSelectedPermissionIds(getPermissionIds(createdRole));
      setNewRoleName("");
      setNewRoleDescription("");
      setNewRolePermissionIds([]);
      setSuccessMessage("Role created.");
    } catch (err) {
      console.error(err);
      setError("Failed to create role.");
    } finally {
      setCreatingRole(false);
    }
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

  return {
    roles,
    permissions,
    selectedRoleId,
    selectedPermissionIds,
    newRoleName,
    newRoleDescription,
    newRolePermissionIds,
    loading,
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
  };
};
