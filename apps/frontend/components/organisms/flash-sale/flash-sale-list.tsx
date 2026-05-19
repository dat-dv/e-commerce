"use client";

import { useCallback } from "react";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import { FlashSaleCard } from "@/components/molecules/product-card/flash-sale-card";
import { VirtualGrid } from "@/components/molecules/virtual-grid";
import { ListingSectionHeader } from "@/components/molecules/listing-section-header";
import { TProduct } from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";
import { IPaginationMeta } from "@/utils/request/request.types";
import EmptyState from "@/components/molecules/empty-space";
import { usePaginationWithSSRData } from "@/hooks/use-pagination";
import { useTranslations } from "next-intl";

interface FlashSaleListProps {
  products: TProduct[];
  meta: IPaginationMeta;
}

const FlashSaleList = ({ products, meta }: FlashSaleListProps) => {
  const t = useTranslations("FlashSalePage.list");
  const fetchFlashSalePage = useCallback(
    (params: { page: number; limit: number }) =>
      productsUseCase.getFlashSale.execute(params),
    [],
  );
  const {
    items,
    meta: pageMeta,
    totalPages,
    hasMore,
    loadingMore,
    error,
    loadMore,
  } = usePaginationWithSSRData<TProduct, { page: number; limit: number }>({
    initialItems: products,
    initialMeta: meta,
    params: { page: meta.page, limit: meta.limit },
    fetchPage: fetchFlashSalePage,
    getItemKey: (item) => item.id,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative z-20 w-full py-10"
    >
      {items.length > 0 ? (
        <div className="space-y-8">
          <ListingSectionHeader
            eyebrow={t("eyebrow")}
            title={t("title", { total: pageMeta.total })}
            icon={
              <Flame
                size={18}
                className="fill-red-500 text-red-500"
                aria-hidden="true"
              />
            }
            meta={t("meta", {
              page: String(pageMeta.page),
              totalPages: String(totalPages),
            })}
          />

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3 text-sm font-semibold text-red-500"
            >
              {error}
            </p>
          )}

          <VirtualGrid
            data={items}
            renderItem={(product) => <FlashSaleCard product={product} />}
            keyExtractor={(product) => product.id}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onLoadMore={loadMore}
            loadingText={t("loadingMore")}
            endText={t("end")}
            gridClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
            itemClassName="min-w-0"
            rowClassName="mb-4"
            columns={{
              base: 2,
              sm: 3,
              md: 4,
              lg: 5,
            }}
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

export default FlashSaleList;
