"use client";

import { toast } from "@ecommerce/ui";
import { useState } from "react";

import type { AdminPermissionRepository } from "@/domain/permission";

interface IUseCreateRoleFormParams {
  permissionRepository: AdminPermissionRepository;
  onCreated: () => void;
}

export const useCreateRoleForm = ({
  permissionRepository,
  onCreated,
}: IUseCreateRoleFormParams) => {
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newRolePermissionIds, setNewRolePermissionIds] = useState<string[]>(
    [],
  );
  const [creatingRole, setCreatingRole] = useState(false);

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
      onCreated();
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
    creatingRole,
    toggleNewRolePermission,
    handleCreateRole,
    setNewRoleName,
    setNewRoleDescription,
  };
};
