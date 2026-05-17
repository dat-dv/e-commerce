"use client";

import { createContext, ReactNode, useState } from "react";
import { createCategoryProductsStore } from "@/store/category-products-store";
import { ICategoryProductsState } from "@/store/category-products-store/category-products-store.type";

export type CategoryProductsStore = ReturnType<
  typeof createCategoryProductsStore
>;

export const CategoryProductsContext =
  createContext<CategoryProductsStore | null>(null);

interface CategoryProductsProviderProps {
  children: ReactNode;
  initState?: Partial<ICategoryProductsState>;
}

export const CategoryProductsProvider = ({
  children,
  initState,
}: CategoryProductsProviderProps) => {
  const [store] = useState(() => createCategoryProductsStore(initState));

  return (
    <CategoryProductsContext.Provider value={store}>
      {children}
    </CategoryProductsContext.Provider>
  );
};
