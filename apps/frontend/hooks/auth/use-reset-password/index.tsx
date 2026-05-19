"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { useTranslations } from "next-intl";
import {
  getResetPasswordSchema,
  TResetPasswordSchema,
} from "@/components/molecules/reset-password-form/reset-password.schema";
import { authUseCase } from "@/domain/auth/use-cases";
import { useAuthStore } from "../use-auth-store";
import { APP_ROUTES } from "@/constants/routes";

const useResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const t = useTranslations("Validation");

  const setLoading = useAuthStore((state) => state.setLoading);
  const isLoading = useAuthStore((state) => state.loading);

  const methods = useForm<TResetPasswordSchema>({
    resolver: zodResolver(getResetPasswordSchema(t)),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleResetPassword = async (data: TResetPasswordSchema) => {
    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }

    setLoading(true);
    try {
      await authUseCase.resetPassword.execute({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Password reset successfully");
      router.push(APP_ROUTES.SIGN_IN);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Reset password failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleResetPassword,
    methods,
    isLoading,
    token,
  };
};

export default useResetPassword;
