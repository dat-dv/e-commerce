import { toast } from "@ecommerce/ui";
import { usersUseCase } from "@/domain/users/use-cases";
import { useTranslations } from "next-intl";
import { useAuthStore } from "../auth/use-auth-store";

export function useUpLoadProfileAvatar() {
  const t = useTranslations("ProfilePage.toast");
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const isLoading = useAuthStore((state) => state.loading);

  const uploadAvatar = async (file: File) => {
    setLoading(true);
    if (!user?.id) return;
    try {
      const response = await usersUseCase.uploadAvatar.execute({
        avatar: file,
        userId: user.id,
      });
      if (response.status === "success" && response.data) {
        setUser({ ...user, avatarUrl: response.data });
        toast.success(t("uploadAvatarSuccess"));
      } else {
        throw new Error(response.message || "Update failed");
      }
    } catch {
      toast.error(t("uploadAvatarFailed"));
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    uploadAvatar,
  };
}
