"use client";

import type { IPermissionResponse } from "@ecommerce/shared";
import { useLoadOnce } from "@ecommerce/ui";
import { toast } from "@ecommerce/ui";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import {
  AdminPermissionRepository,
  type TAdminRole,
} from "@/domain/permission";

import { groupPermissionsByCategory } from "../../components/organisms/permissions-view/permissions-view.utils";

export const useRolePermissionsData = () => {
  const searchParams = useSearchParams();
  const roleId = searchParams.get("id");

  const permissionRepository = useMemo(
    () => new AdminPermissionRepository(),
    [],
  );

  const [role, setRole] = useState<TAdminRole | null>(null);
  const [permissions, setPermissions] = useState<IPermissionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const groupedPermissions = useMemo(
    () => groupPermissionsByCategory(permissions),
    [permissions],
  );

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [rolesResponse, permissionsResponse] = await Promise.all([
        permissionRepository.getRoles(),
        permissionRepository.getPermissions(),
      ]);

      const nextRoles = rolesResponse.items;
      const targetRole = roleId
        ? nextRoles.find((r) => r.id === roleId) || nextRoles[0]
        : nextRoles[0];

      setRole(targetRole ?? null);
      setPermissions(permissionsResponse.items);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load role permissions data.");
    } finally {
      setLoading(false);
    }
  }, [permissionRepository, roleId]);

  useLoadOnce(loadData);

  return {
    role,
    permissions,
    groupedPermissions,
    loading,
    permissionRepository,
  };
};
