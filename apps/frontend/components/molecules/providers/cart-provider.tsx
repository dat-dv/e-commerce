"use client";

import { createContext, ReactNode, useEffect, useState } from "react";

import { cartUseCase } from "@/domain/cart/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { createCartStore } from "@/store/cart-store";
import { TCartItem } from "@/store/cart-store/cart-store.type";

export type CartStore = ReturnType<typeof createCartStore>;
export const CartContext = createContext<CartStore | null>(null);

export interface CartProviderProps {
  children: ReactNode;
  initState?: TCartItem[];
}

export const CartProvider = ({ children, initState }: CartProviderProps) => {
  const user = useAuthStore((s) => s.user);
  const [store] = useState(() =>
    createCartStore({
      items: initState ?? [],
      selectedSkuIds: initState?.map((item) => item.skuId) ?? [],
      hasHydrated: initState !== undefined,
    }),
  );

  useEffect(() => {
    if (!user) return;
    const fetchCart = async () => {
      try {
        const res = await cartUseCase.getCart.execute();
        const setItems = store.getState().setItems;
        const selectItems = store.getState().selectItems;
        const setHasHydrated = store.getState().setHasHydrated;
        if (res.data) {
          setItems(res.data.items);
          selectItems(res.data.items.map((item) => item.skuId));
        }
        setHasHydrated(true);
      } catch {
        store.getState().clearCart();
        store.getState().setHasHydrated(true);
      }
    };

    fetchCart();
  }, [user, store]);

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
};
