"use client";

import { useLoadOnce } from "@ecommerce/ui";
import { toast } from "@ecommerce/ui";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";

import { adminPermissionUseCase } from "@/domain/permission";
import type {
  IAdminPermission,
  IAdminRole,
} from "@/domain/user/types/user.model";

import { groupPermissionsByCategory } from "../../components/organisms/permissions-view/permissions-view.utils";

export const useRolePermissionsData = () => {
  const searchParams = useSearchParams();
  const roleId = searchParams.get("id");

  const [role, setRole] = useState<IAdminRole | null>(null);
  const [permissions, setPermissions] = useState<IAdminPermission[]>([]);
  const [loading, startLoadingTransition] = useTransition();

  const groupedPermissions = useMemo(
    () => groupPermissionsByCategory(permissions),
    [permissions],
  );

  const loadData = useCallback(() => {
    startLoadingTransition(async () => {
      try {
        const [rolesResponse, permissionsResponse] = await Promise.all([
          adminPermissionUseCase.getRoles.execute(),
          adminPermissionUseCase.getPermissions.execute(),
        ]);

        const nextRoles = rolesResponse.items;
        const targetRole = roleId
          ? nextRoles.find((r) => r.id === roleId) || nextRoles[0]
          : nextRoles[0];

        setRole(targetRole ?? null);
        setPermissions(permissionsResponse.items);
      } catch {
        toast.error("Failed to load role permissions data.");
      }
    });
  }, [roleId]);

  useLoadOnce(loadData);

  return {
    role,
    permissions,
    groupedPermissions,
    loading,
  };
};
