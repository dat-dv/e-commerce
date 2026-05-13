import { useContext } from "react";
import { useStore } from "zustand";
import { ProductsPageContext } from "@/components/molecules/providers/products-page-provider";
import { IProductsPageStore } from "@/store/products-page-store/products-page-store.type";

export const useProductsPageStore = <T>(
  selector: (state: IProductsPageStore) => T,
): T => {
  const store = useContext(ProductsPageContext);
  if (!store) {
    throw new Error("Missing ProductsPageProvider");
  }

  return useStore(store, selector);
};
