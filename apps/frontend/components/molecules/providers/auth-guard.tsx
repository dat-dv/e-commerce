"use client";

import { useStore } from "zustand";
import { ReactNode, useContext, useEffect } from "react";
import { AuthContext } from "./auth-provider";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { APP_ROUTES, CALLBACK_URL_KEY } from "@/constants/routes";
import Loading from "@/components/atoms/loading";

export interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const store = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!store) {
    throw new Error("AuthGuard must be used within AuthProvider");
  }

  const user = useStore(store, (s) => s.user);
  const hasHydrated = useStore(store, (s) => s._hasHydrated);

  useEffect(() => {
    if (hasHydrated && !user) {
      const search = searchParams.toString();
      const callbackUrl = search ? `${pathname}?${search}` : pathname;

      router.replace(
        `${APP_ROUTES.SIGN_IN}?${CALLBACK_URL_KEY}=${encodeURIComponent(callbackUrl)}`,
      );
    }
  }, [hasHydrated, user, router, pathname, searchParams]);

  if (!hasHydrated || !user) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return children;
};
