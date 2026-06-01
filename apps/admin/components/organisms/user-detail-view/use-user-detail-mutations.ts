import { toast } from "@ecommerce/ui";
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
) => {
  const router = useRouter();
  const userRepository = useMemo(() => new AdminUserRepository(), []);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSaveUser = async (form: IUserDetailFormState) => {
    if (!userId) return;

    setSaving(true);

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender,
        roleId: form.roleId || undefined,
        avatarId: form.avatarId || undefined,
      };

      const updatedUser = await userRepository.updateUser(userId, payload);
      const avatarsResponse = await userRepository.getUserAvatars(userId);

      onSaveSuccess(updatedUser, avatarsResponse);
      toast.success("User profile updated successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userId) return;
    if (!window.confirm("Delete this user?")) return;

    setDeleting(true);

    try {
      await userRepository.deleteUser(userId);
      toast.success("Customer deleted successfully.");
      router.push(APP_ROUTES.CUSTOMERS);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user.");
      setDeleting(false);
    }
  };

  return {
    saving,
    deleting,
    handleSaveUser,
    handleDeleteUser,
  };
};
