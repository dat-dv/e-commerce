"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/toast";

import { APP_ROUTES, CALLBACK_URL_KEY } from "@/constants/routes";
import { TAuthRequest } from "@/domain/auth/types/auth.model";
import { authUseCase } from "@/domain/auth/use-cases";
import { cartUseCase } from "@/domain/cart/use-cases";
import { useCartStore } from "@/hooks/cart/use-cart-store";

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
  const setCartItems = useCartStore((state) => state.setItems);
  const selectCartItems = useCartStore((state) => state.selectItems);

  const methods = useForm<LoginSchema>({
    resolver: zodResolver(getLoginSchema(t)),
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
      const cartResponse = await cartUseCase.getCart.execute();
      const cartItems = cartResponse.data?.items ?? [];
      setCartItems(cartItems);
      selectCartItems(cartItems.map((item) => item.skuId));
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
