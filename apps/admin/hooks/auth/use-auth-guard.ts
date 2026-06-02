"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { APP_ROUTES } from "@/constants/routes";
import { adminAuthUseCase } from "@/domain/auth";
import { useAdminUserStore } from "@/store/user";
import { canAccessAdminPath } from "@/utils/permissions";

const PUBLIC_PATHS: string[] = [APP_ROUTES.SIGN_IN, APP_ROUTES.FORGOT_PASSWORD];

export const useAuthGuard = () => {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAdminUserStore((state) => state.user);
  const hasHydrated = useAdminUserStore((state) => state._hasHydrated);
  const setUser = useAdminUserStore((state) => state.setUser);
  const logout = useAdminUserStore((state) => state.logout);

  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSessionVerified, setIsSessionVerified] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (!hasHydrated) return;

    // 1. If we are on a public path (like sign-in)
    if (isPublicPath) {
      setIsForbidden(false);
      if (user) {
        router.replace(APP_ROUTES.DASHBOARD);
        return;
      }
      setIsCheckingSession(false);
      return;
    }

    // 2. If we are on a protected path and have no session/user locally
    if (!user) {
      setIsForbidden(false);
      router.replace(APP_ROUTES.SIGN_IN);
      setIsCheckingSession(false);
      return;
    }

    // 3. If we already verified the session during this mount, skip API call
    if (isSessionVerified) {
      setIsForbidden(!canAccessAdminPath(user, pathname));
      setIsCheckingSession(false);
      return;
    }

    // 4. Verify session in the background
    let ignore = false;

    const checkSession = async () => {
      try {
        const response = await adminAuthUseCase.fetchMe.execute();
        if (ignore) return;

        if (response.status !== "success" || !response.data) {
          throw new Error("Session verification failed");
        }
        setUser(response.data);
        setIsForbidden(!canAccessAdminPath(response.data, pathname));
        setIsSessionVerified(true);
      } catch {
        if (ignore) return;
        logout();
        setIsForbidden(false);
        router.replace(APP_ROUTES.SIGN_IN);
      } finally {
        if (!ignore) {
          setIsCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      ignore = true;
    };
  }, [
    hasHydrated,
    pathname,
    user,
    isSessionVerified,
    router,
    setUser,
    logout,
    isPublicPath,
  ]);

  return {
    hasHydrated,
    isCheckingSession,
    isForbidden,
    isPublicPath,
    user,
  };
};
