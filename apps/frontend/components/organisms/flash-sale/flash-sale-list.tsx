"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import { FlashSaleCard } from "@/components/molecules/product-card/flash-sale-card";
import { VirtualGrid } from "@/components/molecules/virtual-grid";
import { ListingSectionHeader } from "@/components/molecules/listing-section-header";
import { TProduct } from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";
import { IPaginationMeta } from "@/utils/request/request.types";
import EmptyState from "@/components/molecules/empty-space";

interface FlashSaleListProps {
  products: TProduct[];
  meta: IPaginationMeta;
}

const FlashSaleList = ({ products, meta }: FlashSaleListProps) => {
  const [items, setItems] = useState(products);
  const [pageMeta, setPageMeta] = useState(meta);
  const [isPending, startTransition] = useTransition();

  const hasMore = pageMeta.page < pageMeta.totalPages;

  const loadMore = useCallback(() => {
    if (isPending || !hasMore) return;

    startTransition(async () => {
      const nextPage = pageMeta.page + 1;
      const response = await productsUseCase.getFlashSale.execute({
        page: nextPage,
        limit: pageMeta.limit,
      });

      if (response.status !== "success") return;

      setItems((currentItems) => [
        ...currentItems,
        ...response.data.items.filter(
          (nextItem) =>
            !currentItems.some((currentItem) => currentItem.id === nextItem.id),
        ),
      ]);
      setPageMeta(response.data.meta);
    });
  }, [hasMore, isPending, pageMeta.limit, pageMeta.page]);

  const totalPagesText = useMemo(
    () => Math.max(pageMeta.totalPages, 1),
    [pageMeta.totalPages],
  );

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
            eyebrow="Live Deals"
            title={`${pageMeta.total} flash sale products`}
            icon={<Flame size={18} className="fill-red-500 text-red-500" />}
            meta={`Page ${pageMeta.page} of ${totalPagesText}`}
          />

          <VirtualGrid
            data={items}
            renderItem={(product) => <FlashSaleCard product={product} />}
            keyExtractor={(product) => product.id}
            loadingMore={isPending}
            hasMore={hasMore}
            onLoadMore={loadMore}
            loadingText="Loading more deals..."
            endText="All flash sale products loaded"
            gridClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
            itemClassName="min-w-0"
          />
        </div>
      ) : (
        <EmptyState
          title="No flash sale products found"
          description="There are no flash sale products available at the moment."
        />
      )}
    </motion.div>
  );
};

export default FlashSaleList;
