"use client";

import { toast } from "@ecommerce/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

import { APP_ROUTES, CALLBACK_URL_KEY } from "@/constants/routes";
import { TAuthRequest } from "@/domain/auth/types/auth.model";
import { authUseCase } from "@/domain/auth/use-cases";

import { useTranslations } from "next-intl";
import { useAuthStore } from "../use-auth-store";
import { LoginSchema, getLoginSchema } from "./login.schema";

// adapter - react có life cycle riêng nên việc tương tác với các đối tượng khác cần thông qua adapter
// nhận dữ liệu của react -> chuyển sang cho thằng use case
const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Validation");

  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const isLoading = useAuthStore((state) => state.loading);

  const schema = React.useMemo(() => getLoginSchema(t), [t]);

  const methods = useForm<LoginSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (formData: LoginSchema) => {
    const payload: TAuthRequest = {
      email: formData.email,
      password: formData.password,
    };
    setLoading(true);

    try {
      const response = await authUseCase.login.execute(payload);
      setUser(response.data);
      const callbackUrl = searchParams.get(CALLBACK_URL_KEY) || APP_ROUTES.HOME;
      router.replace(callbackUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      toast.error(errorMessage || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    methods,
    isLoading,
  };
};

export default useLogin;
