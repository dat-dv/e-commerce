import { useContext } from "react";
import { useStore } from "zustand";
import { RecommendedContext } from "@/components/molecules/providers/recommended-provider";
import { IRecommendedStore } from "@/store/recommended-store/recommended-store.type";

export const useRecommendedStore = <T>(
  selector: (state: IRecommendedStore) => T,
): T => {
  const store = useContext(RecommendedContext);
  if (!store) {
    throw new Error("Missing RecommendedProvider");
  }

  return useStore(store, selector);
};
