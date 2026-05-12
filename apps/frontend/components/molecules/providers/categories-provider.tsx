"use client";

import { createContext, ReactNode, useState } from "react";
import { createCategoriesStore } from "@/store/categories-store";
import { ICategoriesStoreState } from "@/store/categories-store/categories-store.type";

export type CategoriesStore = ReturnType<typeof createCategoriesStore>;
export const CategoriesContext = createContext<CategoriesStore | null>(null);

export interface CategoriesProviderProps {
  children: ReactNode;
  initState?: Partial<ICategoriesStoreState>;
}

export const CategoriesProvider = ({
  children,
  initState,
}: CategoriesProviderProps) => {
  const [store] = useState(() => createCategoriesStore(initState));

  return (
    <CategoriesContext.Provider value={store}>
      {children}
    </CategoriesContext.Provider>
  );
};
