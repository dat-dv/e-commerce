"use client";

import { createContext, ReactNode, useState } from "react";
import { createProductsPageStore } from "@/store/products-page-store";
import { IProductsPageState } from "@/store/products-page-store/products-page-store.type";

export type ProductsPageStore = ReturnType<typeof createProductsPageStore>;
export const ProductsPageContext = createContext<ProductsPageStore | null>(
  null,
);

export interface ProductsPageProviderProps {
  children: ReactNode;
  initState?: Partial<IProductsPageState>;
}

export const ProductsPageProvider = ({
  children,
  initState,
}: ProductsPageProviderProps) => {
  const [store] = useState(() => createProductsPageStore(initState));

  return (
    <ProductsPageContext.Provider value={store}>
      {children}
    </ProductsPageContext.Provider>
  );
};
