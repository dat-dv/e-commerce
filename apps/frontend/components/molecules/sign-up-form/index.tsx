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
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
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
          className="w-full mt-2"
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
            className="text-primary font-bold hover:underline underline-offset-4 px-0 opacity-100"
          >
            {t("loginLink")}
          </Button>
        </p>
      </div>

      <p className="text-center text-[11px] opacity-40 leading-relax tracking-tight">
        {t("agreementText")}{" "}
        <Link
          href={APP_ROUTES.TERMS}
          className="underline cursor-pointer hover:text-primary transition-colors"
        >
          {t("termsOfService")}
        </Link>{" "}
        {t("and")}{" "}
        <Link
          href={APP_ROUTES.PRIVACY}
          className="underline cursor-pointer hover:text-primary transition-colors"
        >
          {t("privacyPolicy")}
        </Link>
        .
      </p>
    </div>
  );
}
