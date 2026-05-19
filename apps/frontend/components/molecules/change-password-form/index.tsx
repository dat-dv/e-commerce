"use client";

import { Lock } from "lucide-react";
import { useMemo } from "react";
import { FormInput } from "@/components/molecules/form/form-input";
import AppForm from "@/components/molecules/form/app-form";
import Button from "@/components/atoms/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordFormData,
  getChangePasswordSchema,
} from "./change-password.schema";
import { useTranslations } from "next-intl";

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
      <div className="space-y-4 max-w-md">
        <FormInput
          name="currentPassword"
          label={t("currentPasswordLabel")}
          type="password"
          placeholder={t("passwordPlaceholder")}
          variant="outline"
          className="h-10 text-sm rounded-xl"
          disabled={loading}
        />

        <FormInput
          name="newPassword"
          label={t("newPasswordLabel")}
          type="password"
          placeholder={t("passwordPlaceholder")}
          variant="outline"
          className="h-10 text-sm rounded-xl"
          disabled={loading}
        />

        <FormInput
          name="confirmPassword"
          label={t("confirmNewPasswordLabel")}
          type="password"
          placeholder={t("passwordPlaceholder")}
          variant="outline"
          className="h-10 text-sm rounded-xl"
          disabled={loading}
        />

        <Button
          type="submit"
          loading={loading}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors w-full mt-6"
        >
          <Lock size={18} aria-hidden="true" />
          {t("submit")}
        </Button>
      </div>
    </AppForm>
  );
};
