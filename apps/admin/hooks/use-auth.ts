import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { type TSignInSchema } from "@/components/organisms/sign-in-view/sign-in-view.schema";
import { adminAuthUseCase } from "@/domain/auth";
import { useAdminUserStore } from "@/store/user";

export const useAdminAuth = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setUser = useAdminUserStore((state) => state.setUser);

  const login = async (data: TSignInSchema) => {
    setError(null);
    try {
      const response = await adminAuthUseCase.login.execute(data);

      if (response.status === "success" && response.data) {
        setUser(response.data);
        startTransition(() => {
          router.push("/dashboard");
        });
      } else {
        setError(response.message || "Invalid response status from server");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  return {
    login,
    isLoading: isPending,
    error,
  };
};
