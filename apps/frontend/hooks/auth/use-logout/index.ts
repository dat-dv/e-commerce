import { useRouter } from "next/navigation";

import { APP_ROUTES } from "@/constants/routes";
import { AuthRepository } from "@/domain/auth/infrastructure/auth.repository";
import { LogoutUseCase } from "@/domain/auth/use-cases/logout.use-case";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { appRequest } from "@/utils/request/request";

export const useLogout = () => {
  const router = useRouter();
  const logout = useAuthStore((store) => store.logout);

  const handleClickLogout = async () => {
    try {
      const logoutUseCase = new LogoutUseCase(new AuthRepository(appRequest));
      await logoutUseCase.execute();
      logout();
      router.push(APP_ROUTES.HOME);
    } catch (error) {
      console.error("Failed to logout at server:", error);
    }
  };

  return { handleClickLogout };
};
