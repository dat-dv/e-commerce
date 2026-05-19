"use client";

import React from "react";
import { useChangePassword } from "@/hooks/profile/use-change-password";
import { ChangePasswordForm } from "@/components/molecules/change-password-form";
import { useTranslations } from "next-intl";

export const PasswordView = () => {
  const t = useTranslations("ProfilePasswordPage");
  const { changePassword, loading } = useChangePassword();

  return (
    <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
      <div className="mb-6 min-w-0">
        <h1 className="text-2xl font-bold text-content break-words">
          {t("title")}
        </h1>
        <p className="text-sm text-content/60 break-words">
          {t("description")}
        </p>
      </div>

      <ChangePasswordForm onSubmit={changePassword} loading={loading} />
    </div>
  );
};
