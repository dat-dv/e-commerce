"use client";

import { AnimatePresence } from "framer-motion";
import { useFavorites } from "@/hooks/favorites/use-favorites";
import { useRecommendedProducts } from "@/hooks/products/use-recommended-products";

import FavoritesGrid from "./favorites-list";
import RecommendedSection from "./recommend-section";
import FavoritesBanner from "./favorite-banner";

export const FavoritesView = () => {
  const favoriteProps = useFavorites();
  const { recommendedProducts, loadingRecommended } = useRecommendedProducts();

  return (
    <div className="min-h-screen bg-transparent selection:bg-primary/20">
      <FavoritesBanner count={favoriteProps.favorites.length} />

      <main className="container mx-auto px-4 pb-32 max-w-7xl">
        {/* Favorites Section */}
        <section>
          <AnimatePresence mode="wait">
            <FavoritesGrid {...favoriteProps} />
          </AnimatePresence>
        </section>

        {/* Recommendations Section */}
        <RecommendedSection
          products={recommendedProducts}
          loading={loadingRecommended}
        />
      </main>
    </div>
  );
};
