"use client";

import type { IPermissionResponse } from "@ecommerce/shared";
import { useLoadOnce } from "@ecommerce/ui";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

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
  const searchParams = useSearchParams();
  const initialRoleId = searchParams.get("id");

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
  const [loading, setLoading] = useState(true);
  const [savingPermissions, setSavingPermissions] = useState(false);
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

      const targetRole = initialRoleId
        ? nextRoles.find((r) => r.id === initialRoleId) || nextRoles[0]
        : nextRoles[0];

      const firstRole = targetRole ?? null;
      setSelectedRoleId(firstRole?.id ?? "");
      setSelectedPermissionIds(getPermissionIds(firstRole));
    } catch (err) {
      console.error(err);
      setError(DEFAULT_PERMISSION_ERROR);
    } finally {
      setLoading(false);
    }
  }, [permissionRepository, initialRoleId]);

  useLoadOnce(loadPermissionData);

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

  return {
    permissions,
    selectedRoleId,
    selectedPermissionIds,
    loading,
    savingPermissions,
    error,
    successMessage,
    selectedRole,
    groupedPermissions,
    togglePermission,
    handleSavePermissions,
  };
};
