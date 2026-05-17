import { useContext } from "react";
import { useStore } from "zustand";
import { CategoryProductsContext } from "@/components/molecules/providers/category-products-provider";
import { ICategoryProductsStore } from "@/store/category-products-store/category-products-store.type";

export const useCategoryProductsStore = <T>(
  selector: (state: ICategoryProductsStore) => T,
): T => {
  const store = useContext(CategoryProductsContext);

  if (!store) {
    throw new Error("Missing CategoryProductsProvider");
  }

  return useStore(store, selector);
};
