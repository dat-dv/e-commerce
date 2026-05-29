"use client";

import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import useForgotPassword from "@/hooks/auth/use-forgot-password";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import AppForm from "../form/app-form";
import { FormButton } from "../form/form-button";
import { FormInput } from "../form/form-input";
import { FormPhoneInput } from "../form/form-phone-input";
import { TForgotPasswordSchema } from "./forgot-password.schema";
import SuccessModal from "./success-modal";

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
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="text-center">
        <h1 className="text-content text-2xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm opacity-60">{t("description")}</p>
      </div>
      {false && (
        <div className="bg-content/5 flex gap-1 rounded-xl p-1">
          <Button
            variant="ghost"
            className={cn(
              "h-auto flex-1 rounded-lg px-0 py-2 text-sm font-bold transition-all hover:bg-transparent active:scale-100",
              method === "email"
                ? "text-primary bg-white shadow-sm hover:bg-white"
                : "text-content/60 hover:text-content",
            )}
            onClick={() => setMethod("email")}
          >
            {t("emailTab")}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "h-auto flex-1 rounded-lg px-0 py-2 text-sm font-bold transition-all hover:bg-transparent active:scale-100",
              method === "phone"
                ? "text-primary bg-white shadow-sm hover:bg-white"
                : "text-content/60 hover:text-content",
            )}
            onClick={() => setMethod("phone")}
          >
            {t("phoneTab")}
          </Button>
        </div>
      )}
      <AppForm<TForgotPasswordSchema>
        methods={methods}
        onSubmit={handleForgotPassword}
      >
        {method === "email" && (
          <FormInput
            name="email"
            label={t("emailLabel")}
            placeholder={t("emailPlaceholder")}
            type="email"
            autoComplete="email"
          />
        )}
        {false && <FormPhoneInput name="phone" label={t("phoneLabel")} />}
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
          {t("rememberedPassword")}
          <Button
            variant="ghost"
            size="sm"
            href={APP_ROUTES.SIGN_IN}
            className="text-primary px-0 font-bold underline-offset-4 opacity-100 hover:bg-transparent hover:underline"
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
