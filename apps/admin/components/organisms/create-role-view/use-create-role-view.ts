"use client";

import type { IPermissionResponse } from "@ecommerce/shared";
import { useLoadOnce } from "@ecommerce/ui";
import { toast } from "@ecommerce/ui";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { APP_ROUTES } from "@/constants/routes";
import { AdminPermissionRepository } from "@/domain/permission";

import { groupPermissionsByCategory } from "../permissions-view/permissions-view.utils";

export const useCreateRoleView = () => {
  const router = useRouter();
  const permissionRepository = useMemo(
    () => new AdminPermissionRepository(),
    [],
  );

  const [permissions, setPermissions] = useState<IPermissionResponse[]>([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newRolePermissionIds, setNewRolePermissionIds] = useState<string[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [creatingRole, setCreatingRole] = useState(false);

  const groupedPermissions = useMemo(
    () => groupPermissionsByCategory(permissions),
    [permissions],
  );

  const loadPermissionData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await permissionRepository.getPermissions();
      setPermissions(response.items);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load permissions.");
    } finally {
      setLoading(false);
    }
  }, [permissionRepository]);

  useLoadOnce(loadPermissionData);

  const toggleNewRolePermission = (permissionId: string) => {
    setNewRolePermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId],
    );
  };

  const handleCreateRole = async () => {
    const roleName = newRoleName.trim();
    if (!roleName) return;

    setCreatingRole(true);

    try {
      await permissionRepository.createRole({
        role_name: roleName,
        description: newRoleDescription.trim() || undefined,
        permissions: newRolePermissionIds,
      });

      toast.success("Role created successfully.");
      router.push(APP_ROUTES.PERMISSIONS);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create role.");
    } finally {
      setCreatingRole(false);
    }
  };

  return {
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
  };
};
