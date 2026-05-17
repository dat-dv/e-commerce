import { useContext } from "react";
import { useStore } from "zustand";
import { RecentViewedContext } from "@/components/molecules/providers/recent-viewed-provider";
import { IRecentViewedStore } from "@/store/recent-viewed-store/recent-viewed-store.type";

export const useRecentViewedStore = <T>(
  selector: (state: IRecentViewedStore) => T,
): T => {
  const store = useContext(RecentViewedContext);
  if (!store) {
    throw new Error("Missing RecentViewedProvider");
  }

  return useStore(store, selector);
};
