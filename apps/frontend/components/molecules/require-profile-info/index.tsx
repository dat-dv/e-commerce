"use client";

import { useTranslations } from "next-intl";

import {
  AppDialog,
  AppDialogPanel,
  AppDialogTitle,
} from "@/components/atoms/aria/dialog";
import { authUseCase } from "@/domain/auth/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { RequireProfileInfoForm } from "./require-profile-info-form";
import { TRequireProfileInfoSchema } from "./require-profile-info-form.schema";

const RequireProfileInfoModal = () => {
  const t = useTranslations("RequireProfileInfoModal");
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const show = user && (!user.firstName || !user.lastName || !user.dateOfBirth);

  const onSubmit = async (data: TRequireProfileInfoSchema) => {
    try {
      if (!user?.id) return;
      const res = await authUseCase.updateProfile.execute({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        id: user.id,
      });
      const updatedUser = res.data;

      setUser({
        ...user,
        ...updatedUser,
      });
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  if (!show) return null;

  return (
    <AppDialog isOpen onClose={() => {}} isDismissable={false}>
      <AppDialogPanel className="w-full max-w-xl bg-surface rounded-3xl p-8">
        <AppDialogTitle className="text-2xl font-bold mb-2">
          {t("title")}
        </AppDialogTitle>
        <p className="text-content/60 mb-6">{t("description")}</p>
        <RequireProfileInfoForm
          onSubmit={onSubmit}
          logout={logout}
          user={user}
        />
      </AppDialogPanel>
    </AppDialog>
  );
};

export default RequireProfileInfoModal;
