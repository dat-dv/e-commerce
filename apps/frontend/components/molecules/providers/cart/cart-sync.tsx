"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/hooks/cart/use-cart-store";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { cartUseCase } from "@/domain/cart/use-cases";

export const CartSync = () => {
  const setItems = useCartStore((s) => s.setItems);
  const setHasHydrated = useCartStore((s) => s.setHasHydrated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) return;

    const getCart = async () => {
      const cartRes = await cartUseCase.getCart.execute();
      const initialItems = cartRes?.data?.items || [];

      setItems(initialItems);
      setHasHydrated(true);
    };
    getCart();
  }, [setItems, setHasHydrated, user]);

  return null;
};
