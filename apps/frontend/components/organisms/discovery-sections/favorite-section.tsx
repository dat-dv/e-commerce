"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/favorites/use-favorites";
import { ProductCarousel } from "@/components/molecules/product-carousel";
import { APP_ROUTES } from "@/constants/routes";
import { RecentViewedSectionSkeleton } from "./skeletons";
import { useConfig } from "@/hooks/config/use-config";
import { useLoadOnce } from "@/hooks/use-load-once";
import { TProduct } from "@/domain/products/types/products.model";

export const FavoriteSection = () => {
  const { favorites, loading, fetchFavorites } = useFavorites();
  const { language } = useConfig();
  const { loading: initialLoading } = useLoadOnce(fetchFavorites);
  const products = favorites
    .map((favorite) => favorite.product)
    .filter((product): product is TProduct => Boolean(product));

  if ((loading || initialLoading) && products.length === 0) {
    return <RecentViewedSectionSkeleton />;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-6">
      <ProductCarousel
        title="Your Wishlist"
        href={APP_ROUTES.FAVORITES}
        icon={Heart}
        products={products}
        rows={2}
        lang={language}
      />
    </div>
  );
};

export default FavoriteSection;
