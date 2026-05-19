"use client";

import { useTranslations } from "next-intl";

import {
  AriaDialog,
  AriaDialogPanel,
  AriaDialogTitle,
} from "@/components/atoms/aria/dialog";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { RequireProfileInfoForm } from "./require-profile-info-form";
import { TRequireProfileInfoSchema } from "./require-profile-info-form.schema";
import { authUseCase } from "@/domain/auth/use-cases";

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
    <AriaDialog
      isOpen
      onClose={() => {}}
      isDismissable={false}
      className="relative z-[100]"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 min-w-[420px]">
        {/* Full-screen container to center the panel */}
        <AriaDialogPanel className="w-full max-w-xl bg-surface rounded-3xl p-8 animate-in zoom-in-95">
          <AriaDialogTitle className="text-2xl font-bold mb-2">
            {t("title")}
          </AriaDialogTitle>
          <p className="text-content/60 mb-6">{t("description")}</p>
          <RequireProfileInfoForm
            onSubmit={onSubmit}
            logout={logout}
            user={user}
          />
        </AriaDialogPanel>
      </div>
    </AriaDialog>
  );
};

export default RequireProfileInfoModal;
