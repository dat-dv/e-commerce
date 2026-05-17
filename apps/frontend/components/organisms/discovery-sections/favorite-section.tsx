"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/favorites/use-favorites";
import { ProductCarousel } from "@/components/molecules/product-carousel";
import { APP_ROUTES } from "@/constants/routes";
import { RecentViewedSectionSkeleton } from "./skeletons";
import { useConfig } from "@/hooks/config/use-config";

export const FavoriteSection = () => {
  const hookState = useFavorites();
  const { language } = useConfig();

  const loading = hookState.loading;

  const products = hookState.favorites
    .map((fav) => fav.product!)
    .filter(Boolean);

  if (loading && products.length === 0) {
    return <RecentViewedSectionSkeleton />;
  }

  // Render nothing if not loading and empty
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
        rows={1}
        lang={language}
      />
    </div>
  );
};

export default FavoriteSection;
