"use client";

import { createContext, ReactNode, useState } from "react";
import { createRecentViewedStore } from "@/store/recent-viewed-store";
import { IRecentViewedStoreState } from "@/store/recent-viewed-store/recent-viewed-store.type";

export type RecentViewedStore = ReturnType<typeof createRecentViewedStore>;
export const RecentViewedContext = createContext<RecentViewedStore | null>(
  null,
);

export interface RecentViewedProviderProps {
  children: ReactNode;
  initState?: Partial<IRecentViewedStoreState>;
}

export const RecentViewedProvider = ({
  children,
  initState,
}: RecentViewedProviderProps) => {
  const [store] = useState(() => createRecentViewedStore(initState));

  return (
    <RecentViewedContext.Provider value={store}>
      {children}
    </RecentViewedContext.Provider>
  );
};
