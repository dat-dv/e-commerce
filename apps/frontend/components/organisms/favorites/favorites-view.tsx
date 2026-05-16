"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/molecules/product-card";
import { VirtualGrid } from "@/components/molecules/virtual-grid";
import { useFavorites } from "@/hooks/favorites/use-favorites";
import { useRecommendedProducts } from "@/hooks/products/use-recommended-products";
import { Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { TProduct } from "@/domain/products/types/products.model";

export const FavoritesView = () => {
  const { favorites, loading, hasMore, fetchMore } = useFavorites();
  const { recommendedProducts, loadingRecommended } = useRecommendedProducts();

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="bg-transparent border-b border-content/[0.05]">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-black text-content tracking-tight">
              Wishlist
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl space-y-24">
        {/* Favorites Section */}
        <section>
          <AnimatePresence mode="wait">
            {!loading && favorites.length === 0 ? (
              <motion.div
                key="empty-favorites"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-content/[0.02] flex items-center justify-center text-content/10 mb-6">
                  <Heart size={40} />
                </div>
                <h3 className="text-xl font-bold text-content mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-content/40 text-sm max-w-xs mb-8 font-medium">
                  Add items you love to your wishlist and they will appear here.
                </p>
                <Link
                  href={APP_ROUTES.HOME}
                  className="px-8 py-3 bg-content text-surface text-sm font-bold rounded-xl hover:-translate-y-1 transition-all"
                >
                  Start Exploring
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="favorites-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <VirtualGrid
                  data={favorites}
                  loadingMore={loading}
                  hasMore={hasMore}
                  onLoadMore={fetchMore}
                  renderItem={(fav) => (
                    <ProductCard
                      key={fav.productId}
                      showFavoriteButton={false}
                      product={fav.product!}
                    />
                  )}
                  keyExtractor={(fav) => fav.productId}
                  loadingText="Loading wishlist..."
                  endText="End of wishlist"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Recommendations Section */}
        <section className="pt-12 border-t border-content/[0.05]">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles size={20} />
            </div>
            <h2 className="text-2xl font-bold text-content tracking-tight">
              Recommended for You
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loadingRecommended
              ? [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] bg-content/[0.02] rounded-3xl animate-pulse border border-content/5"
                  />
                ))
              : recommendedProducts.map((product: TProduct) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </section>
      </div>
    </div>
  );
};
