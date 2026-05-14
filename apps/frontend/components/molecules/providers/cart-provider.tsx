"use client";

import { createContext, ReactNode, useEffect, useState } from "react";

import { createCartStore } from "@/store/cart-store";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { cartUseCase } from "@/domain/cart/use-cases";

export type CartStore = ReturnType<typeof createCartStore>;
export const CartContext = createContext<CartStore | null>(null);

export interface CartProviderProps {
  children: ReactNode;
  initState?: TCartItem[];
}

export const CartProvider = ({ children, initState }: CartProviderProps) => {
  const [store] = useState(() =>
    createCartStore({
      items: initState || [],
      selectedSkuIds: initState?.map((item) => item.sku_id) || [],
      _hasHydrated: initState ? true : false,
    }),
  );

  useEffect(() => {
    if (initState) return;
    const fetchAddresses = async () => {
      try {
        const res = await cartUseCase.getCart.execute();
        const setItems = store.getState().setItems;
        const setHasHydrated = store.getState().setHasHydrated;
        if (res.data) {
          setItems(res.data.items);
          setHasHydrated(true);
        }
      } catch (error) {
        console.error("Failed to sync cart:", error);
      }
    };

    fetchAddresses();
  }, [initState, store]);

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
};
