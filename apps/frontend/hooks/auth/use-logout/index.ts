import { useRouter } from "next/navigation";

import { APP_ROUTES } from "@/constants/routes";
import { AuthRepository } from "@/domain/auth/infrastructure/auth.repository";
import { LogoutUseCase } from "@/domain/auth/use-cases/logout.use-case";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useCartStore } from "@/hooks/cart/use-cart-store";
import { appRequest } from "@/utils/request";

export const useLogout = () => {
  const router = useRouter();
  const logout = useAuthStore((store) => store.logout);
  const clearCart = useCartStore((s) => s.clearCart);

  const handleClickLogout = async () => {
    try {
      const logoutUseCase = new LogoutUseCase(new AuthRepository(appRequest));
      await logoutUseCase.execute();
      logout();
      clearCart();
      router.push(APP_ROUTES.HOME);
    } catch (error) {
      console.error("Failed to logout at server:", error);
    }
  };

  return { handleClickLogout };
};
