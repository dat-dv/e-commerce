import { usersUseCase } from "@/domain/users/use-cases";
import { useAuthStore } from "../auth/use-auth-store";
import { toast } from "react-toastify";

export function useUpLoadProfileAvatar() {
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
        setUser({ ...user, avatar_url: response.data });
        toast.success("Avatar updated successfully!");
      } else {
        throw new Error(response.message || "Update failed");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Update failed", {
        toastId: "profile-error",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    uploadAvatar,
  };
}
