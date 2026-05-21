"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import Button from "@/components/atoms/button";
import Input from "@/components/atoms/input";
import { APP_ROUTES } from "@/constants/routes";
import { useRegister } from "@/hooks/auth/use-register";

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

      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Input
          id="email"
          label={t("emailLabel")}
          type="email"
          placeholder={t("emailPlaceholder")}
          {...methods.register("email")}
          autoComplete="email"
          error={methods.formState.errors.email?.message}
        />

        <Input
          id="password"
          label={t("passwordLabel")}
          type="password"
          placeholder={t("passwordPlaceholder")}
          {...methods.register("password")}
          autoComplete="new-password"
          error={methods.formState.errors.password?.message}
        />

        <Input
          id="confirmPassword"
          label={t("confirmPasswordLabel")}
          type="password"
          placeholder={t("confirmPasswordPlaceholder")}
          {...methods.register("confirmPassword")}
          autoComplete="new-password"
          error={methods.formState.errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="mt-2 w-full"
          loading={loading}
        >
          {loading ? t("submitting") : t("submit")}
        </Button>
      </form>

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

      <p className="leading-relax text-center text-[11px] tracking-tight opacity-40">
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
