import EmptyState from "@/components/molecules/empty-space";
import { ProductCard } from "@/components/molecules/product-card";
import { VirtualGrid } from "@/components/molecules/virtual-grid";
import { TUserFavoriteProductItem } from "@/domain/user-favorite-products/types/user-favorite-products.model";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const FavoritesGrid = ({
  favorites,
  loading,
  loadingMore,
  hasMore,
  fetchMore,
}: {
  favorites: TUserFavoriteProductItem[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  fetchMore: () => void;
}) => {
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
        columns={{ base: 2, md: 3, lg: 4 }}
      />
    </motion.div>
  );
};

export default FavoritesGrid;
