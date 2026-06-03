"use client";

import type { IPermissionResponse } from "@ecommerce/shared";
import { useLoadOnce } from "@ecommerce/ui";
import { toast } from "@ecommerce/ui";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { APP_ROUTES } from "@/constants/routes";
import { AdminPermissionRepository } from "@/domain/permission";

import { groupPermissionsByCategory } from "../../components/organisms/permissions-view/permissions-view.utils";
import { useCreateRoleForm } from "./use-create-role-form";

export const useCreateRoleView = () => {
  const router = useRouter();
  const permissionRepository = useMemo(
    () => new AdminPermissionRepository(),
    [],
  );

  const [permissions, setPermissions] = useState<IPermissionResponse[]>([]);
  const [loading, setLoading] = useState(true);

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

  const createRoleForm = useCreateRoleForm({
    permissionRepository,
    onCreated: () => router.push(APP_ROUTES.PERMISSIONS),
  });

  return {
    ...createRoleForm,
    loading,
    groupedPermissions,
    router,
  };
};
