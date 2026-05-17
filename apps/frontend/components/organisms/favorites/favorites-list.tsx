import { ProductCard } from "@/components/molecules/product-card";
import { VirtualGrid } from "@/components/molecules/virtual-grid";
import { useFavorites } from "@/hooks/favorites/use-favorites";
import { motion } from "framer-motion";
import EmptyState from "@/components/molecules/empty-space";

const FavoritesGrid = ({
  favorites,
  loading,
  hasMore,
  fetchMore,
}: Pick<
  ReturnType<typeof useFavorites>,
  "favorites" | "loading" | "hasMore" | "fetchMore"
>) => {
  if (!loading && favorites.length === 0) {
    return (
      <EmptyState
        title="Your collection is empty"
        description="The items you love deserve a place here. Start exploring our latest collections."
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
        loadingText="Discovering more..."
        endText="You've seen everything in your wishlist"
      />
    </motion.div>
  );
};

export default FavoritesGrid;
