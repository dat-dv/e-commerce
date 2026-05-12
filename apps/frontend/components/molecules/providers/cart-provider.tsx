"use client";

import { createContext, ReactNode, useState } from "react";
import { useStore } from "zustand";

import Loading from "@/components/atoms/loading";
import { createCartStore } from "@/store/cart-store";
import { ICartStoreState } from "@/store/cart-store/cart-store.type";

export type CartStore = ReturnType<typeof createCartStore>;
export const CartContext = createContext<CartStore | null>(null);

export interface CartProviderProps {
  children: ReactNode;
  initState?: Partial<ICartStoreState>;
}

export const CartProvider = ({ children, initState }: CartProviderProps) => {
  const [store] = useState(() =>
    createCartStore({
      ...initState,
      _hasHydrated: initState ? true : false,
    }),
  );
  const hasHydrated = useStore(store, (s) => s._hasHydrated);

  if (!hasHydrated) {
    return <Loading />;
  }

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
};
