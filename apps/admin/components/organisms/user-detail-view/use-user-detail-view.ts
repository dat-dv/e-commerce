"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { APP_ROUTES } from "@/constants/routes";
import {
  AdminPermissionRepository,
  type TAdminRole,
} from "@/domain/permission";
import { AdminUserRepository, type IAdminUser } from "@/domain/user";

export const useUserDetailView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const userRepository = useMemo(() => new AdminUserRepository(), []);
  const permissionRepository = useMemo(
    () => new AdminPermissionRepository(),
    [],
  );

  const [user, setUser] = useState<IAdminUser | null>(null);
  const [roles, setRoles] = useState<TAdminRole[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingRole, setSavingRole] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadUserDetail = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      setError("Missing user id.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [userResponse, rolesResponse] = await Promise.all([
        userRepository.getUser(userId),
        permissionRepository.getRoles(),
      ]);

      setUser(userResponse);
      setRoles(rolesResponse.items);
      setSelectedRoleId(
        userResponse.roleId || rolesResponse.items[0]?.id || "",
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load user detail.");
    } finally {
      setLoading(false);
    }
  }, [permissionRepository, userId, userRepository]);

  useEffect(() => {
    loadUserDetail();
  }, [loadUserDetail]);

  const handleSaveRole = async () => {
    if (!userId || !selectedRoleId) return;

    setSavingRole(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedUser = await userRepository.updateUser(userId, {
        role_id: selectedRoleId,
      });
      setUser(updatedUser);
      setSuccessMessage("User role updated.");
    } catch (err) {
      console.error(err);
      setError("Failed to update user role.");
    } finally {
      setSavingRole(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userId) return;
    if (!window.confirm("Delete this user?")) return;

    setDeleting(true);
    setError(null);

    try {
      await userRepository.deleteUser(userId);
      router.push(APP_ROUTES.CUSTOMERS);
    } catch (err) {
      console.error(err);
      setError("Failed to delete user.");
      setDeleting(false);
    }
  };

  return {
    user,
    roles,
    selectedRoleId,
    loading,
    savingRole,
    deleting,
    error,
    successMessage,
    setSelectedRoleId,
    setSuccessMessage,
    handleSaveRole,
    handleDeleteUser,
    router,
  };
};
