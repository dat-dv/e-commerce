"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import { Button } from "@ecommerce/ui";
import { TurnstileWrapper } from "@/components/molecules/cloudflare-turnstile";
import { APP_ROUTES } from "@/constants/routes";
import { TYPOGRAPHY } from "@/constants/typography";
import { useRegister } from "@/hooks/auth/use-register";
import { AppForm } from "@ecommerce/ui";
import { FormInput } from "@ecommerce/ui";
import { FormListenerDirty } from "@ecommerce/ui";

export default function SignUpForm() {
  const t = useTranslations("RegisterPage");
  const { methods, onSubmit, loading } = useRegister();

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="space-y-1">
        <h2 className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          {t("title")}
        </h2>
        <p className="text-content/60 font-medium tracking-tight">
          {t("description")}
        </p>
      </div>

      <AppForm
        className="flex flex-col gap-4"
        methods={methods}
        onSubmit={onSubmit}
      >
        <FormInput
          name="email"
          label={t("emailLabel")}
          type="email"
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
        />

        <FormInput
          name="password"
          label={t("passwordLabel")}
          type="password"
          placeholder={t("passwordPlaceholder")}
          autoComplete="new-password"
        />

        <FormInput
          name="confirmPassword"
          label={t("confirmPasswordLabel")}
          type="password"
          placeholder={t("confirmPasswordPlaceholder")}
          autoComplete="new-password"
        />

        <TurnstileWrapper>
          {({ isVerified }) => (
            <FormListenerDirty>
              {(isDirty) => (
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="mt-2 w-full"
                  loading={loading}
                  disabled={!isVerified || !isDirty}
                >
                  {loading ? t("submitting") : t("submit")}
                </Button>
              )}
            </FormListenerDirty>
          )}
        </TurnstileWrapper>
      </AppForm>

      <div className="text-center">
        <p className="text-sm opacity-60">
          {t("alreadyHaveAccount")}{" "}
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

      <p
        className={`leading-relax text-center ${TYPOGRAPHY.caption} tracking-tight opacity-40`}
      >
        {t("agreementText")}{" "}
        <Link
          href={APP_ROUTES.TERMS}
          className="hover:text-primary cursor-pointer underline transition-colors"
        >
          {t("termsOfService")}
        </Link>{" "}
        {t("and")}{" "}
        <Link
          href={APP_ROUTES.PRIVACY}
          className="hover:text-primary cursor-pointer underline transition-colors"
        >
          {t("privacyPolicy")}
        </Link>
        .
      </p>
    </div>
  );
}
