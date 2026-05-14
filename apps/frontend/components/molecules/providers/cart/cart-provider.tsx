"use client";

import { createContext, ReactNode, useState } from "react";

import { createCartStore } from "@/store/cart-store";

export type CartStore = ReturnType<typeof createCartStore>;
export const CartContext = createContext<CartStore | null>(null);

export interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [store] = useState(() => createCartStore());

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
};
