"use client";

import type { IOrderResponse } from "@ecommerce/shared";
import { useLoadOnce } from "@ecommerce/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { APP_ROUTES } from "@/constants/routes";
import { AdminOrderRepository } from "@/domain/order";
import {
  AdminPermissionRepository,
  type TAdminRole,
} from "@/domain/permission";
import {
  AdminUserRepository,
  type IAdminUpdateUserInput,
  type IAdminUser,
  type IAdminUserAvatar,
} from "@/domain/user";
import type { ApiListResponse } from "@/utils/request";

export interface IUserDetailFormState {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  roleId: string;
  avatarId: string;
}

export const useUserDetailView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const userRepository = useMemo(() => new AdminUserRepository(), []);
  const permissionRepository = useMemo(
    () => new AdminPermissionRepository(),
    [],
  );
  const orderRepository = useMemo(() => new AdminOrderRepository(), []);

  const [user, setUser] = useState<IAdminUser | null>(null);
  const [avatars, setAvatars] = useState<IAdminUserAvatar[]>([]);
  const [orders, setOrders] = useState<ApiListResponse<IOrderResponse>>({
    items: [],
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
  });
  const [roles, setRoles] = useState<TAdminRole[]>([]);
  const [form, setForm] = useState<IUserDetailFormState>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    roleId: "",
    avatarId: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      const [userResponse, rolesResponse, avatarsResponse, ordersResponse] =
        await Promise.all([
          userRepository.getUser(userId),
          permissionRepository.getRoles(),
          userRepository.getUserAvatars(userId),
          orderRepository.getOrders(1, 10, { user_id: userId }),
        ]);

      setUser(userResponse);
      setAvatars(avatarsResponse);
      setRoles(rolesResponse.items);
      setOrders(
        ordersResponse.data || {
          items: [],
          meta: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
          },
        },
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load user detail.");
    } finally {
      setLoading(false);
    }
  }, [orderRepository, permissionRepository, userId, userRepository]);

  useLoadOnce(loadUserDetail, !!userId);

  useEffect(() => {
    if (!user) return;

    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
      gender:
        user.gender === null || user.gender === undefined
          ? ""
          : String(user.gender),
      roleId: user.roleId || roles[0]?.id || "",
      avatarId:
        user.avatarId || avatars.find((avatar) => avatar.isCurrent)?.id || "",
    });
  }, [avatars, roles, user]);

  const updateForm = <TField extends keyof IUserDetailFormState>(
    field: TField,
    value: IUserDetailFormState[TField],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSuccessMessage(null);
  };

  const handleSaveUser = async () => {
    if (!userId) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload: IAdminUpdateUserInput = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender === "" ? undefined : Number(form.gender),
        roleId: form.roleId || undefined,
        avatarId: form.avatarId || undefined,
      };

      const updatedUser = await userRepository.updateUser(userId, payload);
      setUser(updatedUser);
      const avatarsResponse = await userRepository.getUserAvatars(userId);
      setAvatars(avatarsResponse);
      setSuccessMessage("User updated.");
    } catch (err) {
      console.error(err);
      setError("Failed to update user.");
    } finally {
      setSaving(false);
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
    avatars,
    orders,
    roles,
    form,
    loading,
    saving,
    deleting,
    error,
    successMessage,
    updateForm,
    setSuccessMessage,
    handleSaveUser,
    handleDeleteUser,
    router,
  };
};
