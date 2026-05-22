import { CategoriesContext } from "@/components/molecules/providers/categories-provider";
import { ICategoriesStore } from "@/store/categories-store/categories-store.type";
import { useContext } from "react";
import { useStore } from "zustand";

export const useCategoriesStore = <T>(
  selector: (state: ICategoriesStore) => T,
): T => {
  const store = useContext(CategoriesContext);
  if (!store) {
    throw new Error("Missing CategoriesProvider");
  }

  return useStore(store, selector);
};
