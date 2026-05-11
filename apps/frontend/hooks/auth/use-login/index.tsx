"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { APP_ROUTES, CALLBACK_URL_KEY } from "@/constants/routes";
import { IAuthRequest } from "@/domain/auth/types/auth.model";
import { authUseCase } from "@/domain/auth/use-cases";

import { useAuthStore } from "../use-auth-store";
import { LoginSchema, loginSchema } from "./login.schema";

// adapter - react có life cycle riêng nên việc tương tác với các đối tượng khác cần thông qua adapter
// nhận dữ liệu của react -> chuyển sang cho thằng use case
const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const isLoading = useAuthStore((state) => state.loading);

  const methods = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (formData: LoginSchema) => {
    const payload: IAuthRequest = {
      email: formData.email,
      password: formData.password,
    };
    setLoading(true);

    try {
      const response = await authUseCase.login.execute(payload);
      setUser(response.data);
      const callbackUrl = searchParams.get(CALLBACK_URL_KEY) || APP_ROUTES.HOME;
      router.push(callbackUrl);
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
