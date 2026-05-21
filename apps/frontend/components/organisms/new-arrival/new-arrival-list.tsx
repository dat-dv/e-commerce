"use client";

import EmptyState from "@/components/molecules/empty-space";
import { ListingSectionHeader } from "@/components/molecules/listing-section-header";
import { ProductCard } from "@/components/molecules/product-card";
import { VirtualGrid } from "@/components/molecules/virtual-grid";
import {
  PRODUCT_LISTING_GRID_CLASS_NAME,
  PRODUCT_LISTING_GRID_COLUMNS,
} from "@/components/molecules/virtual-grid/grid-presets";
import { TProduct } from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";
import { usePagination } from "@/hooks/use-pagination";
import { IPaginationMeta } from "@/utils/request/request.types";
import { EProductSort } from "@ecommerce/shared";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

interface NewArrivalListProps {
  products: TProduct[];
  meta: IPaginationMeta;
}

const NewArrivalList = ({ products, meta }: NewArrivalListProps) => {
  const t = useTranslations("NewArrivalsPage.list");
  const fetchNewArrivalsPage = useCallback(
    (params: { page: number; limit: number }) =>
      productsUseCase.getProducts.execute({
        ...params,
        sort: EProductSort.DEFAULT.toString(),
      }),
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
  } = usePagination<TProduct>({
    initialData: {
      items: products,
      meta,
    },
    fetchPage: fetchNewArrivalsPage,
    getItemKey: (product) => product.id,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative z-20 w-full py-6 sm:py-10"
    >
      {items.length > 0 ? (
        <div className="space-y-6 sm:space-y-8">
          <ListingSectionHeader
            eyebrow={t("eyebrow")}
            title={t("title", { total: pageMeta.total })}
            icon={
              <Sparkles size={18} className="text-primary" aria-hidden="true" />
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
            renderItem={(product) => <ProductCard product={product} />}
            keyExtractor={(product) => product.id}
            loadingMore={loadingMore}
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
