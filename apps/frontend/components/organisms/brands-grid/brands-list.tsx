"use client";

import { useCallback } from "react";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { BrandCard } from "@/components/molecules/brrand-card";
import { VirtualGrid } from "@/components/molecules/virtual-grid";
import { usePagination } from "@/hooks/use-pagination";
import { brandsUseCase } from "@/domain/brands/use-cases";
import { IPaginationMeta } from "@/utils/request/request.types";

interface IBrandListGridProps {
  brands: TBrand[];
  meta: IPaginationMeta;
  searchQuery?: string;
}

const BrandListGrid = ({
  brands,
  meta,
  searchQuery = "",
}: IBrandListGridProps) => {
  const fetchBrandsPage = useCallback(
    (params: { page: number; limit: number }) =>
      brandsUseCase.getTopBrands.execute(
        params.page,
        params.limit,
        searchQuery || undefined,
      ),
    [searchQuery],
  );

  const { items, loadingMore, hasMore, loadMore } = usePagination({
    initialItems: brands,
    initialMeta: meta,
    fetchPage: fetchBrandsPage,
    getItemKey: (brand) => brand.id,
  });

  return (
    <VirtualGrid<TBrand>
      data={items}
      gridClassName="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[240px]"
      itemClassName="h-full"
      columns={{ base: 1, md: 4 }}
      renderItem={(brand, index) => {
        const isLarge = index === 0 || index === 5 || index === 10;
        return <BrandCard brand={brand} isLarge={isLarge} index={index} />;
      }}
      loadingMore={loadingMore}
      hasMore={hasMore}
      onLoadMore={loadMore}
      loadingText="Loading more brands..."
      endText="All brands loaded"
    />
  );
};

export default BrandListGrid;
