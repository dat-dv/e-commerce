"use client";

import { TProduct } from "@/domain/products/types/products.model";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { HomepagePrivate } from "./home-view-private";
import HomepagePublic from "./home-view-public";

interface HomeViewProps {
  flashSaleProducts: TProduct[];
}

export const HomeView = ({ flashSaleProducts }: HomeViewProps) => {
  const isLogin = useAuthStore((state) => !!state.user?.id);

  return isLogin ? (
    <HomepagePrivate flashSaleProducts={flashSaleProducts} />
  ) : (
    <HomepagePublic flashSaleProducts={flashSaleProducts} />
  );
};
