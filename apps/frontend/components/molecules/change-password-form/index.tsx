"use client";

import Button from "@/components/atoms/button";
import AppForm from "@/components/molecules/form/app-form";
import { FormInput } from "@/components/molecules/form/form-input";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  ChangePasswordFormData,
  getChangePasswordSchema,
} from "./change-password.schema";

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordFormData) => Promise<boolean>;
  loading: boolean;
}

export const ChangePasswordForm = ({
  onSubmit,
  loading,
}: ChangePasswordFormProps) => {
  const t = useTranslations("ProfilePasswordPage.form");
  const tValidation = useTranslations("Validation");
  const schema = useMemo(
    () => getChangePasswordSchema(tValidation),
    [tValidation],
  );
  const methods = useForm<ChangePasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleFormSubmit = async (data: ChangePasswordFormData) => {
    const success = await onSubmit(data);
    if (success) {
      methods.reset();
    }
  };

  return (
    <AppForm methods={methods} onSubmit={handleFormSubmit}>
      <div className="space-y-4">
        <FormInput
          name="currentPassword"
          label={t("currentPasswordLabel")}
          type="password"
          placeholder={t("passwordPlaceholder")}
          variant="outline"
          className={cn(UI_RADIUS.input, "h-10 text-sm")}
          disabled={loading}
        />

        <FormInput
          name="newPassword"
          label={t("newPasswordLabel")}
          type="password"
          placeholder={t("passwordPlaceholder")}
          variant="outline"
          className={cn(UI_RADIUS.input, "h-10 text-sm")}
          disabled={loading}
        />

        <FormInput
          name="confirmPassword"
          label={t("confirmNewPasswordLabel")}
          type="password"
          placeholder={t("passwordPlaceholder")}
          variant="outline"
          className={cn(UI_RADIUS.input, "h-10 text-sm")}
          disabled={loading}
        />

        <Button
          type="submit"
          loading={loading}
          className={cn(
            UI_RADIUS.control,
            "flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 font-medium hover:bg-primary/90 transition-colors w-full mt-6",
          )}
        >
          <Lock size={18} aria-hidden="true" />
          {t("submit")}
        </Button>
      </div>
    </AppForm>
  );
};
