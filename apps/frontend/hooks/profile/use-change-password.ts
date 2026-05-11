import { useState } from "react";
import { toast } from "react-toastify";
import { ChangePasswordFormData } from "../../components/molecules/change-password-form/change-password.schema";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const changePassword = async (data: ChangePasswordFormData) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Password changed successfully", data);
      toast.success("Password changed successfully!");
      return true; // Return success status
    } catch (error) {
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
