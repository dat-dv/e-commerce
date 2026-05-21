import { StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import { PUBLIC_ENV } from "@/config/public.env.config";

import { IAuthStore, IAuthStoreState } from "./user-store.type";

const createAuthStoreCreator =
  (initState?: Partial<IAuthStoreState>): StateCreator<IAuthStore> =>
  (set) => {
    const state: IAuthStore = {
      user: null,
      loading: false,
      hasHydrated: false,
      ...initState,
      setLoading: (loading: boolean) => set({ loading }),
      setUser: (user) => set({ user }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
      logout: () => {
        set({ user: null });
      },
    };

    return state;
  };

export const createUserStore = (initState?: Partial<IAuthStoreState>) =>
  createStore<IAuthStore>()(
    devtools(createAuthStoreCreator(initState), {
      name: "AuthStore",
      enabled: PUBLIC_ENV.IS_DEBUG,
    }),
  );
