import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { type TSignInSchema } from "@/components/organisms/sign-in-view/sign-in-view.schema";
import { APP_ROUTES } from "@/constants/routes";
import { adminAuthUseCase } from "@/domain/auth";
import { useAdminUserStore } from "@/store/user";

export const useAdminAuth = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setUser = useAdminUserStore((state) => state.setUser);
  const clearUser = useAdminUserStore((state) => state.logout);

  const login = async (data: TSignInSchema) => {
    setError(null);
    try {
      const user = await adminAuthUseCase.login.execute(data);
      setUser(user);
      startTransition(() => {
        router.push(APP_ROUTES.DASHBOARD);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  const logout = async () => {
    try {
      await adminAuthUseCase.logout.execute();
    } finally {
      clearUser();
      router.push(APP_ROUTES.SIGN_IN);
    }
  };

  return {
    login,
    logout,
    isLoading: isPending,
    error,
  };
};
