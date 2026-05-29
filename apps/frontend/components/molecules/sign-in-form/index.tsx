"use client";

import { Button } from "@ecommerce/ui";
import { APP_ROUTES } from "@/constants/routes";
import useLogin from "@/hooks/auth/use-login";
import { useTranslations } from "next-intl";

import { TurnstileWrapper } from "@/components/molecules/cloudflare-turnstile";
import { AppForm } from "@ecommerce/ui";
import { FormButton } from "@ecommerce/ui";
import { FormInput } from "@ecommerce/ui";
import { FormListenerDirty } from "@ecommerce/ui";

export default function SignInForm() {
  const t = useTranslations("LoginPage");
  const { handleLogin, methods, isLoading } = useLogin();

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="space-y-1">
        <h2 className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent">
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

        <div className="-mt-2 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            href={APP_ROUTES.FORGOT_PASSWORD}
            className="text-primary px-0 text-xs font-bold underline-offset-4 opacity-100 hover:bg-transparent hover:underline"
          >
            {t("forgotPassword")}
          </Button>
        </div>

        <TurnstileWrapper>
          {({ isVerified }) => (
            <FormListenerDirty>
              {(isDirty) => (
                <FormButton
                  type="submit"
                  isLoading={isLoading}
                  loadingText={t("submitting")}
                  className="mt-2"
                  disabled={!isDirty || !isVerified}
                >
                  {t("submit")}
                </FormButton>
              )}
            </FormListenerDirty>
          )}
        </TurnstileWrapper>
      </AppForm>

      <div className="text-center">
        <p className="text-sm opacity-60">
          {t("noAccount")}{" "}
          <Button
            variant="ghost"
            size="sm"
            href={APP_ROUTES.SIGN_UP}
            className="text-primary px-0 font-bold underline-offset-4 opacity-100 hover:bg-transparent hover:underline"
          >
            {t("registerLink")}
          </Button>
        </p>
      </div>
    </div>
  );
}
