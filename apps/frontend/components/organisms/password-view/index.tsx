"use client";

import { FormCard } from "@/components/atoms/form-card";
import { ChangePasswordForm } from "@/components/molecules/change-password-form";
import { useChangePassword } from "@/hooks/profile/use-change-password";
import { useTranslations } from "next-intl";

export const PasswordView = () => {
  const t = useTranslations("ProfilePasswordPage");
  const { changePassword, loading } = useChangePassword();

  return (
    <FormCard className="max-w-full">
      <div className="mb-6 min-w-0">
        <h1 className="text-xl font-bold text-content break-words sm:text-2xl">
          {t("title")}
        </h1>
        <p className="text-sm text-content/60 break-words">
          {t("description")}
        </p>
      </div>

      <ChangePasswordForm onSubmit={changePassword} loading={loading} />
    </FormCard>
  );
};
