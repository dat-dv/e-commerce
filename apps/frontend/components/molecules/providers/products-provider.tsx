"use client";

import { createContext, ReactNode, useState } from "react";
import { createProductsStore } from "@/store/products-store";
import { IProductsStoreState } from "@/store/products-store/products-store.type";

export type ProductsStore = ReturnType<typeof createProductsStore>;
export const ProductsContext = createContext<ProductsStore | null>(null);

export interface ProductsProviderProps {
  children: ReactNode;
  initState?: Partial<IProductsStoreState>;
}

export const ProductsProvider = ({
  children,
  initState,
}: ProductsProviderProps) => {
  const [store] = useState(() => createProductsStore(initState));

  return (
    <ProductsContext.Provider value={store}>
      {children}
    </ProductsContext.Provider>
  );
};
