"use client";

import { useLoadOnce } from "@ecommerce/ui";
import { toast } from "@ecommerce/ui";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { APP_ROUTES } from "@/constants/routes";
import { adminPermissionUseCase } from "@/domain/permission";
import type { IAdminRole } from "@/domain/user/types/user.model";

export const useRolesView = () => {
  const router = useRouter();

  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // The API doesn't have pagination params mapped in getRoles signature fully in current repo (it's getRoles(page?, limit?) but we'll fetch all)
      const response = await adminPermissionUseCase.getRoles.execute(1, 100);
      setRoles(response.items);
    } catch (err) {
      console.error(err);
      setError("Failed to load roles.");
      toast.error("Failed to load roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useLoadOnce(loadData);

  const handleEditRole = (role: IAdminRole) => {
    router.push(`${APP_ROUTES.PERMISSIONS}?id=${role.id}`);
  };

  const filteredRoles = useMemo(() => {
    if (!searchQuery) return roles;
    const lower = searchQuery.toLowerCase();
    return roles.filter(
      (r) =>
        r.roleName?.toLowerCase().includes(lower) ||
        r.description?.toLowerCase().includes(lower),
    );
  }, [roles, searchQuery]);

  return {
    roles: filteredRoles,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    handleEditRole,
  };
};
