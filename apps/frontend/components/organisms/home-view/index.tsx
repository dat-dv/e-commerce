"use client";

import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { TProduct } from "@/domain/products/types/products.model";
import { HomepagePrivate } from "./home-view-private";
import HomepagePublic from "./home-view-public";
import { useTranslations } from "next-intl";

interface HomeViewProps {
  flashSaleProducts: TProduct[];
}

export const HomeView = ({ flashSaleProducts }: HomeViewProps) => {
  const isLogin = useAuthStore((state) => !!state.user?.id);

  const t = useTranslations();
  console.log("333", t("HomePage.title"));

  return isLogin ? (
    <HomepagePrivate flashSaleProducts={flashSaleProducts} />
  ) : (
    <HomepagePublic flashSaleProducts={flashSaleProducts} />
  );
};
