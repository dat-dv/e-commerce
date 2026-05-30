"use client";

import { ForgotPasswordForm as UiForgotPasswordForm } from "@ecommerce/ui";
import { APP_ROUTES } from "@/constants/routes";
import useForgotPassword from "@/hooks/auth/use-forgot-password";
import { useTranslations } from "next-intl";
import { TForgotPasswordSchema } from "./forgot-password.schema";

export default function ForgotPasswordForm() {
  const t = useTranslations("ForgotPasswordPage");
  const {
    handleForgotPassword,
    methods,
    isLoading,
    method,
    setMethod,
    isModalOpen,
    setIsModalOpen,
    modalContent,
    isSent,
  } = useForgotPassword();

  return (
    <UiForgotPasswordForm<TForgotPasswordSchema>
      methods={methods}
      onSubmit={handleForgotPassword}
      isLoading={isLoading}
      method={method}
      onMethodChange={setMethod}
      isSent={isSent}
      signInHref={APP_ROUTES.SIGN_IN}
      isModalOpen={isModalOpen}
      onModalClose={() => setIsModalOpen(false)}
      modalContent={modalContent}
      labels={{
        title: t("title"),
        description: t("description"),
        emailTab: t("emailTab"),
        phoneTab: t("phoneTab"),
        emailLabel: t("emailLabel"),
        emailPlaceholder: t("emailPlaceholder"),
        phoneLabel: t("phoneLabel"),
        submitting: t("submitting"),
        sendResetLink: t("sendResetLink"),
        sendOtp: t("sendOtp"),
        rememberedPassword: t("rememberedPassword"),
        loginLink: t("loginLink"),
        modalCloseLabel: t("modalCloseLabel"),
        modalConfirmLabel: t("modalConfirmLabel"),
      }}
    />
  );
}
