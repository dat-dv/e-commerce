import { ProductCard } from "@/components/molecules/product-card";
import { VirtualGrid } from "@/components/molecules/virtual-grid";
import { useFavorites } from "@/hooks/favorites/use-favorites";
import { motion } from "framer-motion";
import EmptyState from "@/components/molecules/empty-space";
import { useTranslations } from "next-intl";

const FavoritesGrid = ({
  favorites,
  loading,
  loadingMore,
  hasMore,
  fetchMore,
}: Pick<
  ReturnType<typeof useFavorites>,
  "favorites" | "loading" | "loadingMore" | "hasMore" | "fetchMore"
>) => {
  const t = useTranslations("FavoritesPage");

  if (!loading && favorites.length === 0) {
    return (
      <EmptyState
        title={t("list.emptyTitle")}
        description={t("list.emptyDescription")}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
        loadingText={t("list.loadingText")}
        endText={t("list.endText")}
        columns={{
          base: 2,
          sm: 3,
          md: 4,
          lg: 5,
        }}
      />
    </motion.div>
  );
};

export default FavoritesGrid;
