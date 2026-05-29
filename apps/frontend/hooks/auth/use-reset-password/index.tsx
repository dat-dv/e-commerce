"use client";

import { toast } from "@ecommerce/ui";
import {
  getResetPasswordSchema,
  TResetPasswordSchema,
} from "@/components/molecules/reset-password-form/reset-password.schema";
import { APP_ROUTES } from "@/constants/routes";
import { authUseCase } from "@/domain/auth/use-cases";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../use-auth-store";

const useResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const t = useTranslations("Validation");

  const setLoading = useAuthStore((state) => state.setLoading);
  const isLoading = useAuthStore((state) => state.loading);
  const schema = useMemo(() => getResetPasswordSchema(t), [t]);

  const methods = useForm<TResetPasswordSchema>({
    resolver: zodResolver(schema),
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
