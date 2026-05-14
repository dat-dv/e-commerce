import { create } from "zustand";

interface HeaderState {
  isOpenCategory: boolean;
  setIsOpenCategory: (isOpenCategory: boolean) => void;
  activeCategoryId: string | null;
  setActiveCategoryId: (activeCategoryId: string) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
  isOpenCategory: false,
  setIsOpenCategory: (isOpenCategory) => set({ isOpenCategory }),
  activeCategoryId: null,
  setActiveCategoryId: (activeCategoryId: string) => set({ activeCategoryId }),
}));
