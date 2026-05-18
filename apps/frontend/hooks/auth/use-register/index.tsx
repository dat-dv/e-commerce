"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { APP_ROUTES, CALLBACK_URL_KEY } from "@/constants/routes";
import { authUseCase } from "@/domain/auth/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";

import { RegisterSchema, registerSchema } from "./register.schema";

export const useRegister = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setLoading = useAuthStore((state) => state.setLoading);
  const loading = useAuthStore((state) => state.loading);

  const methods = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    setLoading(true);

    try {
      await authUseCase.register.execute(data);
      toast.success("Registration successful! Please login.");

      const callbackUrl = searchParams.get(CALLBACK_URL_KEY);
      const signInUrl = callbackUrl
        ? `${APP_ROUTES.SIGN_IN}?${CALLBACK_URL_KEY}=${encodeURIComponent(callbackUrl)}`
        : APP_ROUTES.SIGN_IN;

      router.push(signInUrl);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      toast.error(errorMessage, { toastId: "auth-error" });
    } finally {
      setLoading(false);
    }
  };

  return {
    methods,
    onSubmit: methods.handleSubmit(onSubmit),
    loading,
  };
};
