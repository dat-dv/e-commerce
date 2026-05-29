"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import useResetPassword from "@/hooks/auth/use-reset-password";
import { TResetPasswordSchema } from "./reset-password.schema";
import AppForm from "../form/app-form";
import { FormInput } from "../form/form-input";
import { FormButton } from "../form/form-button";
import { Button } from "@ecommerce/ui";
import { APP_ROUTES } from "@/constants/routes";

export default function ResetPasswordForm() {
  const t = useTranslations("ResetPasswordPage");
  const { handleResetPassword, methods, isLoading, token } = useResetPassword();

  if (!token) {
    notFound();
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="text-center">
        <h1 className="text-content text-2xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm opacity-60">{t("description")}</p>
      </div>

      <AppForm<TResetPasswordSchema>
        methods={methods}
        onSubmit={handleResetPassword}
        className="flex flex-col gap-4"
      >
        <FormInput
          name="password"
          label={t("newPasswordLabel")}
          placeholder={t("newPasswordPlaceholder")}
          type="password"
          autoComplete="new-password"
        />

        <FormInput
          name="confirmPassword"
          label={t("confirmNewPasswordLabel")}
          placeholder={t("confirmNewPasswordPlaceholder")}
          type="password"
          autoComplete="new-password"
        />

        <FormButton
          type="submit"
          isLoading={isLoading}
          loadingText={t("submitting")}
          className="mt-2"
        >
          {t("submit")}
        </FormButton>
      </AppForm>

      <div className="text-center">
        <p className="text-sm opacity-60">
          {t("rememberedPassword")}{" "}
          <Button
            variant="ghost"
            size="sm"
            href={APP_ROUTES.SIGN_IN}
            className="text-primary px-0 font-bold underline-offset-4 opacity-100 hover:underline"
          >
            {t("loginLink")}
          </Button>
        </p>
      </div>
    </div>
  );
}
