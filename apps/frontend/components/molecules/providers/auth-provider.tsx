"use client";

import {
  createContext,
  ReactNode,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { useStore } from "zustand";

import Loading from "@/components/atoms/loading";
import { AuthRepository } from "@/domain/auth/infrastructure/auth.repository";
import { FetchMeUseCase } from "@/domain/auth/use-cases/fetch-me.use-case";
import { createUserStore } from "@/store/user-store";
import { IAuthStoreState } from "@/store/user-store/user-store.type";
import { safe } from "@/utils/promise";
import { appRequest } from "@/utils/request/request";

export type UserStore = ReturnType<typeof createUserStore>;
export const AuthContext = createContext<UserStore | null>(null);

export interface AuthProviderProps {
  children: ReactNode;
  initState?: Partial<IAuthStoreState>;
}

export const AuthProvider = ({ children, initState }: AuthProviderProps) => {
  const [store] = useState(() =>
    createUserStore({
      ...initState,
      _hasHydrated: initState ? true : false,
    }),
  );
  const hasHydrated = useStore(store, (s) => s._hasHydrated);
  const user = useStore(store, (s) => s.user);
  const hasCheckedAuthRef = useRef(false);

  const initAuthStore = useEffectEvent(async () => {
    if (!hasHydrated || hasCheckedAuthRef.current) return;
    hasCheckedAuthRef.current = true;
    if (!user) return;
    try {
      const authRepo = new AuthRepository(appRequest);
      const response = await safe(new FetchMeUseCase(authRepo).execute());

      const authStore = store.getState();
      if (response && response.data) {
        authStore.setUser(response.data);
      } else {
        authStore.setUser(null);
      }
    } catch {
      store.getState().setUser(null);
    }
  });

  useEffect(() => {
    initAuthStore();
  }, [hasHydrated, user, store]);

  if (!hasHydrated) {
    return <Loading />;
  }

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
};
