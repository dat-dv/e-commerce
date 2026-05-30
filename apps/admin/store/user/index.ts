import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { type IAdminUser } from "@/domain/user";

interface IAdminUserState {
  user: IAdminUser | null;
  _hasHydrated: boolean;
}

interface IAdminUserActions {
  setUser: (user: IAdminUser | null) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export type TAdminUserStore = IAdminUserState & IAdminUserActions;

export const useAdminUserStore = create<TAdminUserStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        _hasHydrated: false,

        setUser: (user) => set({ user }),
        logout: () => set({ user: null }),
        setHasHydrated: (_hasHydrated) => set({ _hasHydrated }),
      }),
      {
        name: "ADMIN_USER_STORE",
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      },
    ),
    {
      name: "AdminUserStore",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
