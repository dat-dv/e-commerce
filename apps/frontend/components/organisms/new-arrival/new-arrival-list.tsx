"use client";
import { EmptyState } from "@ecommerce/ui";

import { ListingSectionHeader } from "@/components/molecules/listing-section-header";
import { ProductCard } from "@/components/molecules/product-card";
import { VirtualGrid } from "@/components/molecules/virtual-grid";
import {
  PRODUCT_LISTING_GRID_CLASS_NAME,
  PRODUCT_LISTING_GRID_COLUMNS,
} from "@/components/molecules/virtual-grid/grid-presets";
import { TProduct } from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";
import usePagination from "@/hooks/use-pagination";
import { PaginatedInitialData } from "@/utils/request/request.types";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

interface NewArrivalListProps {
  initialData: PaginatedInitialData<TProduct>;
}

const NewArrivalList = ({ initialData }: NewArrivalListProps) => {
  const t = useTranslations("NewArrivalsPage.list");
  const { data, loading, getData } = usePagination<
    TProduct,
    { page: number; limit: number; search: string }
  >({
    isSyncWithSearchParams: false,
    initialData,
    fetchPage: productsUseCase.getProducts.execute,
  });

  const hasMore = data.meta.page < data.meta.totalPages;

  const loadMore = () => {
    getData({ page: data.meta.page + 1 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative z-20 w-full py-6 sm:py-10"
    >
      {data.items.length > 0 ? (
        <div className="space-y-6 sm:space-y-8">
          <ListingSectionHeader
            eyebrow={t("eyebrow")}
            title={t("title", { total: data.meta.total })}
            icon={
              <Sparkles size={18} className="text-primary" aria-hidden="true" />
            }
            meta={t("meta", {
              page: String(data.meta.page),
              totalPages: String(data.meta.totalPages),
            })}
          />

          <VirtualGrid
            data={data.items}
            renderItem={(product) => <ProductCard product={product} />}
            keyExtractor={(product) => product.id}
            loadingMore={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            loadingText={t("loadingMore")}
            endText={t("end")}
            gridClassName={PRODUCT_LISTING_GRID_CLASS_NAME}
            itemClassName="min-w-0"
            rowClassName="mb-4"
            columns={PRODUCT_LISTING_GRID_COLUMNS}
          />
        </div>
      ) : (
        <EmptyState
          title={t("empty.title")}
          description={t("empty.description")}
        />
      )}
    </motion.div>
  );
};

export default NewArrivalList;
