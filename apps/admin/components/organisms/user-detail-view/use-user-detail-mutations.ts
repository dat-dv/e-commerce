import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { APP_ROUTES } from "@/constants/routes";
import {
  AdminUserRepository,
  type IAdminUser,
  type IAdminUserAvatar,
} from "@/domain/user";

import type { IUserDetailFormState } from "./use-user-detail-form";

export const useUserDetailMutations = (
  userId: string | null,
  onSaveSuccess: (user: IAdminUser, avatars: IAdminUserAvatar[]) => void,
  setError: (msg: string | null) => void,
  setSuccessMessage: (msg: string | null) => void,
) => {
  const router = useRouter();
  const userRepository = useMemo(() => new AdminUserRepository(), []);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSaveUser = async (form: IUserDetailFormState) => {
    if (!userId) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender === "" ? undefined : Number(form.gender),
        roleId: form.roleId || undefined,
        avatarId: form.avatarId || undefined,
      };

      const updatedUser = await userRepository.updateUser(userId, payload);
      const avatarsResponse = await userRepository.getUserAvatars(userId);

      onSaveSuccess(updatedUser, avatarsResponse);
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
    saving,
    deleting,
    handleSaveUser,
    handleDeleteUser,
    router,
  };
};
