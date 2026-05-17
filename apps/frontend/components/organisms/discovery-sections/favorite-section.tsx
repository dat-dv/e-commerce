"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/favorites/use-favorites";
import { ProductCarousel } from "@/components/molecules/product-carousel";
import { APP_ROUTES } from "@/constants/routes";
import { RecentViewedSectionSkeleton } from "./skeletons";
import { TProduct } from "@/domain/products/types/products.model";
import { TUserFavoriteProductItem } from "@/domain/user-favorite-products/types/user-favorite-products.model";

export interface FavoriteSectionProps {
  products?: TProduct[];
  favorites?: TUserFavoriteProductItem[];
  loading?: boolean;
}

export const FavoriteSection = ({
  products: propProducts,
  favorites: propFavorites,
  loading: propLoading,
}: FavoriteSectionProps) => {
  const hookState = useFavorites();

  const loading = propLoading ?? hookState.loading;

  // Extract products from propProducts, propFavorites, or hookState.favorites
  let products: TProduct[] = [];
  if (propProducts) {
    products = propProducts;
  } else if (propFavorites) {
    products = propFavorites.map((fav) => fav.product!).filter(Boolean);
  } else {
    products = hookState.favorites.map((fav) => fav.product!).filter(Boolean);
  }

  // Render a skeleton if loading and we have no products yet
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
      />
    </div>
  );
};

export default FavoriteSection;
