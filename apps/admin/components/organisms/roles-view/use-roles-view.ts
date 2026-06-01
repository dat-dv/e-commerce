"use client";

import { useLoadOnce } from "@ecommerce/ui";
import { toast } from "@ecommerce/ui";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { APP_ROUTES } from "@/constants/routes";
import {
  AdminPermissionRepository,
  type TAdminRole,
} from "@/domain/permission";

export const useRolesView = () => {
  const router = useRouter();
  const permissionRepository = useMemo(
    () => new AdminPermissionRepository(),
    [],
  );

  const [roles, setRoles] = useState<TAdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // The API doesn't have pagination params mapped in getRoles signature fully in current repo (it's getRoles(page?, limit?) but we'll fetch all)
      const response = await permissionRepository.getRoles(1, 100);
      setRoles(response.items);
    } catch (err) {
      console.error(err);
      setError("Failed to load roles.");
      toast.error("Failed to load roles.");
    } finally {
      setLoading(false);
    }
  }, [permissionRepository]);

  useLoadOnce(loadData);

  const handleEditRole = (role: TAdminRole) => {
    router.push(`${APP_ROUTES.PERMISSIONS}?id=${role.id}`);
  };

  return {
    roles,
    loading,
    error,
    handleEditRole,
  };
};
