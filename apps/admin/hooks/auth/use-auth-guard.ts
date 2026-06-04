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

    if (isPublicPath) {
      setIsForbidden(false);
      if (user) {
        router.replace(APP_ROUTES.DASHBOARD);
        return;
      }
      setIsCheckingSession(false);
      return;
    }

    if (isSessionVerified && user) {
      setIsForbidden(!canAccessAdminPath(user, pathname));
      setIsCheckingSession(false);
      return;
    }

    setIsCheckingSession(true);

    const checkSession = async () => {
      try {
        const currentUser = await adminAuthUseCase.fetchMe.execute();

        setUser(currentUser);
        setIsForbidden(!canAccessAdminPath(currentUser, pathname));
        setIsSessionVerified(true);
      } catch {
        logout();
        setIsForbidden(false);
        router.replace(APP_ROUTES.SIGN_IN);
      } finally {
        setIsCheckingSession(false);
      }
    };

    void checkSession();
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
