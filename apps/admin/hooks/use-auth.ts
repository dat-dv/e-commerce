import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { type TSignInSchema } from "@/components/organisms/sign-in-view/sign-in-view.schema";

export const useAdminAuth = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const login = async (_data: TSignInSchema) => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    startTransition(() => {
      router.push("/dashboard");
    });
  };

  return {
    login,
    isLoading: isPending,
    error: null,
  };
};
