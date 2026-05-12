import { useContext } from "react";
import { useStore } from "zustand";
import { ProductsContext } from "@/components/molecules/providers/products-provider";
import { IProductsStore } from "@/store/products-store/products-store.type";

export const useProductsStore = <T>(
  selector: (state: IProductsStore) => T,
): T => {
  const store = useContext(ProductsContext);
  if (!store) {
    throw new Error("Missing ProductsProvider");
  }

  return useStore(store, selector);
};
