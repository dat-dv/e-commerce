"use client";

import { toast } from "@ecommerce/ui";
import { useState, useTransition } from "react";

import { adminPermissionUseCase } from "@/domain/permission";

interface IUseCreateRoleFormParams {
  onCreated: () => void;
}

export const useCreateRoleForm = ({ onCreated }: IUseCreateRoleFormParams) => {
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newRolePermissionIds, setNewRolePermissionIds] = useState<string[]>(
    [],
  );
  const [creatingRole, startCreatingTransition] = useTransition();

  const toggleNewRolePermission = (permissionId: string) => {
    setNewRolePermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId],
    );
  };

  const handleCreateRole = () => {
    const roleName = newRoleName.trim();
    if (!roleName) return;

    startCreatingTransition(async () => {
      try {
        await adminPermissionUseCase.createRole.execute({
          role_name: roleName,
          description: newRoleDescription.trim() || undefined,
          permissions: newRolePermissionIds,
        });

        toast.success("Role created successfully.");
        onCreated();
      } catch {
        toast.error("Failed to create role.");
      }
    });
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
