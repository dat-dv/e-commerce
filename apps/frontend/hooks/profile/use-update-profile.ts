import { toast } from "@ecommerce/ui";
import { authUseCase } from "@/domain/auth/use-cases";
import { TUpdateUserInput } from "@/domain/users/types/user.model";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { useAuthStore } from "../auth/use-auth-store";

export const useUpdateProfile = () => {
  const t = useTranslations("ProfilePage.toast");
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const updateProfile = useCallback(
    async (data: TUpdateUserInput) => {
      setLoading(true);
      const previousUser = user;
      try {
        // Optimistic Update
        setUser({
          ...user,
          ...data,
          phones: [
            {
              ...(user?.phones?.[0] || { id: "", isDefault: true }),
              phoneNumber:
                data.phoneNumber || user?.phones?.[0]?.phoneNumber || "",
              phoneCode: data.phoneCode || user?.phones?.[0]?.phoneCode || "",
            },
          ],
        });

        const response = await authUseCase.updateProfile.execute(data);

        if (response.status === "success" && response.data) {
          setUser(response.data);
          toast.success(t("updateSuccess"));
          return true;
        } else {
          setUser(previousUser);
          toast.error(t("updateFailed"));
          return false;
        }
      } catch {
        setUser(previousUser);
        toast.error(t("updateFailed"));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setUser, user, t],
  );

  return {
    updateProfile,
    loading,
  };
};
