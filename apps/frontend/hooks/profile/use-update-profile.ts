import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { authUseCase } from "@/domain/auth/use-cases";
import { TUser } from "@/domain/auth/types/auth.model";
import { useAuthStore } from "../auth/use-auth-store";
import { TUpdateUserProfileInput } from "@/domain/users/infrastructure/user.model";

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const updateProfile = useCallback(
    async (data: TUpdateUserProfileInput) => {
      setLoading(true);
      try {
        setUser({
          ...user,
          ...data,
        });
        const response = await authUseCase.updateProfile.execute({
          ...data,
          id: user?.id,
        });

        if (response.status === "success") {
          toast.success("Profile updated successfully!");
          return true;
        } else {
          toast.error("Failed to update profile.");
          return false;
        }
      } catch {
        setUser(user);
        toast.error("Failed to update profile. Please try again.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setUser, user],
  );

  return {
    updateProfile,
    loading,
  };
};
