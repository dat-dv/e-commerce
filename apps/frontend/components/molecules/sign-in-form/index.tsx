"use client";

import { SignInForm as UiSignInForm } from "@ecommerce/ui";
import { APP_ROUTES } from "@/constants/routes";
import useLogin from "@/hooks/auth/use-login";
import { useTranslations } from "next-intl";

import { TurnstileWrapper } from "@/components/molecules/cloudflare-turnstile";
import { type LoginSchema } from "@/hooks/auth/use-login/login.schema";

export default function SignInForm() {
  const t = useTranslations("LoginPage");
  const { handleLogin, methods, isLoading } = useLogin();

  return (
    <UiSignInForm<LoginSchema>
      methods={methods}
      onSubmit={handleLogin}
      isLoading={isLoading}
      forgotPasswordHref={APP_ROUTES.FORGOT_PASSWORD}
      registerHref={APP_ROUTES.SIGN_UP}
      labels={{
        title: t("title"),
        description: t("description"),
        emailLabel: t("emailLabel"),
        emailPlaceholder: t("emailPlaceholder"),
        passwordLabel: t("passwordLabel"),
        passwordPlaceholder: t("passwordPlaceholder"),
        forgotPassword: t("forgotPassword"),
        submitting: t("submitting"),
        submit: t("submit"),
        noAccount: t("noAccount"),
        registerLink: t("registerLink"),
      }}
      renderSubmit={({ renderButton }) => (
        <TurnstileWrapper>
          {({ isVerified }) => renderButton(isVerified)}
        </TurnstileWrapper>
      )}
    />
  );
}
