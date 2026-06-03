import { toast } from "@ecommerce/ui";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { APP_ROUTES } from "@/constants/routes";
import {
  adminUserUseCase,
  type IAdminUser,
  type IAdminUserAvatar,
} from "@/domain/user";

import type { IUserDetailFormState } from "./use-user-detail-form";

export const useUserDetailMutations = (
  userId: string | null,
  onSaveSuccess: (user: IAdminUser, avatars: IAdminUserAvatar[]) => void,
) => {
  const router = useRouter();

  const [saving, startSavingTransition] = useTransition();
  const [deleting, startDeletingTransition] = useTransition();

  const handleSaveUser = (form: IUserDetailFormState) => {
    if (!userId) return;

    startSavingTransition(async () => {
      try {
        const payload = {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          dateOfBirth: form.dateOfBirth || undefined,
          gender: form.gender,
          roleId: form.roleId || undefined,
          avatarId: form.avatarId || undefined,
        };

        const updatedUser = await adminUserUseCase.updateUser.execute(
          userId,
          payload,
        );
        const avatarsResponse =
          await adminUserUseCase.getUserAvatars.execute(userId);

        onSaveSuccess(updatedUser, avatarsResponse);
        toast.success("User profile updated successfully.");
      } catch {
        toast.error("Failed to update user profile.");
      }
    });
  };

  const handleDeleteUser = () => {
    if (!userId) return;
    if (!window.confirm("Delete this user?")) return;

    startDeletingTransition(async () => {
      try {
        await adminUserUseCase.deleteUser.execute(userId);
        toast.success("Customer deleted successfully.");
        router.push(APP_ROUTES.CUSTOMERS);
      } catch {
        toast.error("Failed to delete user.");
      }
    });
  };

  return {
    saving,
    deleting,
    handleSaveUser,
    handleDeleteUser,
  };
};
