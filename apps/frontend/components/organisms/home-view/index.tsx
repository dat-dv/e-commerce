"use client";

import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { HomepagePrivate } from "./home-view-private";
import HomepagePublic from "./home-view-public";

export const HomeView = () => {
  const isLogin = useAuthStore((state) => !!state.user?.id);

  return isLogin ? <HomepagePrivate /> : <HomepagePublic />;
};
