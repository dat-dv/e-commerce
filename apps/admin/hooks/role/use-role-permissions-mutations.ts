"use client";

import { toast } from "@ecommerce/ui";
import { useEffect, useState, useTransition } from "react";

import { adminPermissionUseCase } from "@/domain/permission";
import type { IAdminRole } from "@/domain/user/types/user.model";

import { getPermissionIds } from "../../components/organisms/permissions-view/permissions-view.utils";

export const useRolePermissionsMutations = (role: IAdminRole | null) => {
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    [],
  );
  const [savingPermissions, startSavingTransition] = useTransition();

  useEffect(() => {
    if (role) {
      setSelectedPermissionIds(getPermissionIds(role));
    }
  }, [role]);

  const togglePermission = (permissionId: string) => {
    setSelectedPermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId],
    );
  };

  const handleSavePermissions = () => {
    if (!role?.id) return;

    startSavingTransition(async () => {
      try {
        await adminPermissionUseCase.updateRolePermissions.execute(
          role.id,
          selectedPermissionIds,
        );
        toast.success("Role permissions updated successfully.");
      } catch {
        toast.error("Failed to update role permissions.");
      }
    });
  };

  return {
    selectedPermissionIds,
    savingPermissions,
    togglePermission,
    handleSavePermissions,
  };
};
