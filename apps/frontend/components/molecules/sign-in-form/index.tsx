"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import useLogin from "@/hooks/auth/use-login";

import AppForm from "../form/app-form";
import { FormButton } from "../form/form-button";
import { FormInput } from "../form/form-input";

export default function SignInForm() {
  const t = useTranslations("LoginPage");
  const { handleLogin, methods, isLoading } = useLogin();

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {t("title")}
        </h2>
        <p className="text-content/60 font-medium">{t("description")}</p>
      </div>

      <AppForm
        className="flex flex-col gap-4"
        methods={methods}
        onSubmit={handleLogin}
      >
        <FormInput
          name="email"
          label={t("emailLabel")}
          placeholder={t("emailPlaceholder")}
          type="email"
          autoComplete="email"
        />

        <FormInput
          name="password"
          label={t("passwordLabel")}
          placeholder={t("passwordPlaceholder")}
          type="password"
          autoComplete="current-password"
        />

        <div className="flex justify-end -mt-2">
          <Button
            variant="ghost"
            size="sm"
            href={APP_ROUTES.FORGOT_PASSWORD}
            className="text-xs text-primary font-bold hover:underline underline-offset-4 px-0 opacity-100 hover:bg-transparent"
          >
            {t("forgotPassword")}
          </Button>
        </div>

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
          {t("noAccount")}{" "}
          <Button
            variant="ghost"
            size="sm"
            href={APP_ROUTES.SIGN_UP}
            className="text-primary font-bold hover:underline underline-offset-4 px-0 opacity-100 hover:bg-transparent"
          >
            {t("registerLink")}
          </Button>
        </p>
      </div>
    </div>
  );
}
