"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { useStore } from "zustand";

import Loading from "@/components/atoms/loading";
import { AuthRepository } from "@/domain/auth/infrastructure/auth.repository";
import { FetchMeUseCase } from "@/domain/auth/use-cases/fetch-me.use-case";
import { createUserStore } from "@/store/user-store";
import { IAuthStoreState } from "@/store/user-store/user-store.type";
import { safe } from "@/utils/promise";
import { appRequest } from "@/utils/request/request";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/routes";

export type UserStore = ReturnType<typeof createUserStore>;
export const AuthContext = createContext<UserStore | null>(null);

export interface AuthProviderProps {
  children: ReactNode;
  initState?: Partial<IAuthStoreState>;
}

export const AuthProvider = ({ children, initState }: AuthProviderProps) => {
  const router = useRouter();
  const [store] = useState(() =>
    createUserStore({
      ...initState,
      // If we provide initState, we assume it's "hydrated" for testing
      _hasHydrated: initState ? true : false,
    }),
  );
  const hasHydrated = useStore(store, (s) => s._hasHydrated);

  useEffect(() => {
    if (hasHydrated) return;
    const initAuthStore = async () => {
      try {
        const authRepo = new AuthRepository(appRequest);
        const response = await safe(new FetchMeUseCase(authRepo).execute());

        const authStore = store.getState();
        if (response && response.data && !authStore.user?.id) {
          authStore.setUser(response.data);
          router.replace(APP_ROUTES.HOME);
        }
      } catch {
        // Handle error silently
      } finally {
        store.getState().setHasHydrated(true);
      }
    };
    initAuthStore();
  }, [hasHydrated, router, store]);

  if (!hasHydrated) {
    return <Loading />;
  }

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
};
