import { ProductCard } from "@/components/molecules/product-card";
import { VirtualGrid } from "@/components/molecules/virtual-grid";
import { APP_ROUTES } from "@/constants/routes";
import { useFavorites } from "@/hooks/favorites/use-favorites";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

const FavoritesGrid = ({
  favorites,
  loading,
  loadingMore,
  hasMore,
  fetchMore,
}: ReturnType<typeof useFavorites>) => {
  if (!loading && favorites.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-40 text-center"
      >
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-surface border border-content/5 flex items-center justify-center text-primary shadow-2xl">
            <Heart size={40} strokeWidth={1.5} />
          </div>
        </div>
        <h3 className="text-3xl font-black text-content mb-4 tracking-tight">
          Your collection is empty
        </h3>
        <p className="text-content/40 text-base max-w-sm mb-10 font-medium leading-relaxed">
          The items you love deserve a place here. Start exploring our latest
          collections.
        </p>
        <NextLink
          href={APP_ROUTES.HOME}
          className="group relative px-10 py-4 bg-content text-surface text-sm font-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2">
            <ShoppingBag size={18} />
            START EXPLORING
          </span>
          <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </NextLink>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-12"
    >
      <VirtualGrid
        data={favorites}
        loadingMore={loadingMore}
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
        loadingText="Discovering more..."
        endText="You've seen everything in your wishlist"
      />
    </motion.div>
  );
};

export default FavoritesGrid;
