"use client";

import { createContext, ReactNode, useState } from "react";
import { createRecommendedStore } from "@/store/recommended-store";
import { IRecommendedStoreState } from "@/store/recommended-store/recommended-store.type";

export type RecommendedStore = ReturnType<typeof createRecommendedStore>;

export const RecommendedContext = createContext<RecommendedStore | null>(null);

export interface RecommendedProviderProps {
  children: ReactNode;
  initState?: Partial<IRecommendedStoreState>;
}

export const RecommendedProvider = ({
  children,
  initState,
}: RecommendedProviderProps) => {
  const [store] = useState(() => createRecommendedStore(initState));

  return (
    <RecommendedContext.Provider value={store}>
      {children}
    </RecommendedContext.Provider>
  );
};
