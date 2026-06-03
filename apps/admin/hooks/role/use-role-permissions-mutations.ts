"use client";

import { toast } from "@ecommerce/ui";
import { useEffect, useState } from "react";

import { adminPermissionUseCase } from "@/domain/permission";
import type { IAdminRole } from "@/domain/user/types/user.model";

import { getPermissionIds } from "../../components/organisms/permissions-view/permissions-view.utils";

export const useRolePermissionsMutations = (role: IAdminRole | null) => {
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    [],
  );
  const [savingPermissions, setSavingPermissions] = useState(false);

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

  const handleSavePermissions = async () => {
    if (!role?.id) return;

    setSavingPermissions(true);

    try {
      await adminPermissionUseCase.updateRolePermissions.execute(
        role.id,
        selectedPermissionIds,
      );
      toast.success("Role permissions updated successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role permissions.");
    } finally {
      setSavingPermissions(false);
    }
  };

  return {
    selectedPermissionIds,
    savingPermissions,
    togglePermission,
    handleSavePermissions,
  };
};
