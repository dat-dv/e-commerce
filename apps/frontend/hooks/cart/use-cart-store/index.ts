import { useContext } from "react";
import { useStore } from "zustand";

import { TCartStore } from "@/store/cart-store/cart-store.type";
import { CartContext } from "@/components/molecules/providers/cart-provider";

export const useCartStore = <T>(selector: (state: TCartStore) => T): T => {
  const store = useContext(CartContext);
  if (!store) {
    throw new Error("Missing CartProvider");
  }

  return useStore(store, selector);
};
