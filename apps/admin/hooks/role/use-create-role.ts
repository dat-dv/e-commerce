"use client";

import { useLoadOnce } from "@ecommerce/ui";
import { toast } from "@ecommerce/ui";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { APP_ROUTES } from "@/constants/routes";
import { adminPermissionUseCase } from "@/domain/permission";
import type { IAdminPermission } from "@/domain/user/types/user.model";

import { groupPermissionsByCategory } from "../../components/organisms/permissions-view/permissions-view.utils";
import { useCreateRoleForm } from "./use-create-role-form";

export const useCreateRoleView = () => {
  const router = useRouter();

  const [permissions, setPermissions] = useState<IAdminPermission[]>([]);
  const [loading, setLoading] = useState(true);

  const groupedPermissions = useMemo(
    () => groupPermissionsByCategory(permissions),
    [permissions],
  );

  const loadPermissionData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await adminPermissionUseCase.getPermissions.execute();
      setPermissions(response.items);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load permissions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useLoadOnce(loadPermissionData);

  const createRoleForm = useCreateRoleForm({
    onCreated: () => router.push(APP_ROUTES.PERMISSIONS),
  });

  return {
    ...createRoleForm,
    loading,
    groupedPermissions,
    router,
  };
};
