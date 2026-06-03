"use client";

import { useLoadOnce } from "@ecommerce/ui";
import { toast } from "@ecommerce/ui";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";

import { APP_ROUTES } from "@/constants/routes";
import { adminPermissionUseCase } from "@/domain/permission";
import type { IAdminRole } from "@/domain/user/types/user.model";

export const useRolesView = () => {
  const router = useRouter();

  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [loading, startLoadingTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(() => {
    startLoadingTransition(async () => {
      try {
        const response = await adminPermissionUseCase.getRoles.execute(1, 100);
        setRoles(response.items);
      } catch {
        toast.error("Failed to load roles.");
      }
    });
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
    searchQuery,
    setSearchQuery,
    handleEditRole,
  };
};
