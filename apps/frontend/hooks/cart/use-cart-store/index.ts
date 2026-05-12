import { useContext } from "react";
import { useStore } from "zustand";

import { CartContext } from "@/components/molecules/providers/cart-provider";
import { ICartStore } from "@/store/cart-store/cart-store.type";

export const useCartStore = <T>(selector: (state: ICartStore) => T): T => {
  const store = useContext(CartContext);
  if (!store) {
    throw new Error("Missing CartProvider");
  }

  return useStore(store, selector);
};
