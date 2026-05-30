import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { type TSignInSchema } from "@/components/organisms/sign-in-view/sign-in-view.schema";
import { useAdminUserStore } from "@/store/user";

export const useAdminAuth = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const setUser = useAdminUserStore((state) => state.setUser);

  const login = async (data: TSignInSchema) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    setUser({
      id: "admin-1",
      email: data.email,
      firstName: "Admin",
      lastName: "Chốt Đơn",
      roleName: "admin",
    });

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
