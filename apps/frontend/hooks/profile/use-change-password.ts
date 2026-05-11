import { useState } from "react";
import { toast } from "react-toastify";
import { ChangePasswordFormData } from "../../components/molecules/change-password-form/change-password.schema";
import { authUseCase } from "@/domain/auth/use-cases";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const changePassword = async (data: ChangePasswordFormData) => {
    setLoading(true);
    try {
      const response = await authUseCase.changePassword.execute({
        old_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      });

      if (response.data.success) {
        toast.success("Password changed successfully!");
        return true;
      } else {
        toast.error("Failed to change password.");
        return false;
      }
    } catch {
      toast.error("Failed to change password. Please try again.");
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
