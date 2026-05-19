"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TForgotPasswordSchema } from "./forgot-password.schema";
import AppForm from "../form/app-form";
import { FormInput } from "../form/form-input";
import { FormButton } from "../form/form-button";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import { FormPhoneInput } from "../form/form-phone-input";
import SuccessModal from "./success-modal";
import useForgotPassword from "@/hooks/auth/use-forgot-password";

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
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-content">{t("title")}</h1>
        <p className="text-sm opacity-60 mt-1">{t("description")}</p>
      </div>

      <div className="flex p-1 bg-content/5 rounded-xl gap-1">
        <button
          type="button"
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
            method === "email"
              ? "bg-white shadow-sm text-primary"
              : "text-content/60 hover:text-content",
          )}
          onClick={() => setMethod("email")}
        >
          {t("emailTab")}
        </button>
        <button
          type="button"
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
            method === "phone"
              ? "bg-white shadow-sm text-primary"
              : "text-content/60 hover:text-content",
          )}
          onClick={() => setMethod("phone")}
        >
          {t("phoneTab")}
        </button>
      </div>

      <AppForm<TForgotPasswordSchema>
        methods={methods}
        onSubmit={handleForgotPassword}
      >
        {method === "email" ? (
          <FormInput
            name="email"
            label={t("emailLabel")}
            placeholder={t("emailPlaceholder")}
            type="email"
            autoComplete="email"
          />
        ) : (
          <FormPhoneInput name="phone" label={t("phoneLabel")} />
        )}

        <FormButton
          type="submit"
          isLoading={isLoading}
          loadingText={t("submitting")}
          className="mt-4"
          disabled={isSent}
        >
          {method === "email" ? t("sendResetLink") : t("sendOtp")}
        </FormButton>
      </AppForm>

      <div className="text-center">
        <p className="text-sm opacity-60">
          {t("rememberedPassword")}{" "}
          <Button
            variant="ghost"
            size="sm"
            href={APP_ROUTES.SIGN_IN}
            className="text-primary font-bold hover:underline underline-offset-4 px-0 opacity-100 hover:bg-transparent"
          >
            {t("loginLink")}
          </Button>
        </p>
      </div>

      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        message={modalContent.message}
      />
    </div>
  );
}
