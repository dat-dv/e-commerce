import { toast } from "@ecommerce/ui";
import { authUseCase } from "@/domain/auth/use-cases";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ChangePasswordFormData } from "@/components/molecules/change-password-form/change-password.schema";

export const useChangePassword = () => {
  const t = useTranslations("ProfilePasswordPage.toast");
  const [loading, setLoading] = useState(false);

  const changePassword = async (data: ChangePasswordFormData) => {
    setLoading(true);
    try {
      const response = await authUseCase.changePassword.execute({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      if (response.data.success) {
        toast.success(t("success"));
        return true;
      } else {
        toast.error(t("failed"));
        return false;
      }
    } catch {
      toast.error(t("failedWithRetry"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    changePassword,
    loading,
  };
};
