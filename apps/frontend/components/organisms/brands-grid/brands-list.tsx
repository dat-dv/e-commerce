"use client";

import { TBrand } from "@/domain/homepage/types/homepage.model";
import { BrandCard } from "@/components/molecules/brrand-card";
import { VirtualGrid } from "@/components/molecules/virtual-grid";

interface IBrandListGridProps {
  brands: TBrand[];
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

const BrandListGrid = ({
  brands,
  loadingMore,
  hasMore,
  loadMore,
}: IBrandListGridProps) => {
  return (
    <VirtualGrid<TBrand>
      data={brands}
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
