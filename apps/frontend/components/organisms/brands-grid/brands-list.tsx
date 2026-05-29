"use client";

import {
  BRAND_LISTING_GRID_CLASS_NAME,
  BRAND_LISTING_GRID_COLUMNS,
} from "@/constants/grid-presets";
import { APP_ROUTES } from "@/constants/routes";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { BrandCard, VirtualGrid } from "@ecommerce/ui";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

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
  const t = useTranslations("BrandsPage");

  return (
    <VirtualGrid<TBrand>
      data={brands}
      gridClassName={BRAND_LISTING_GRID_CLASS_NAME}
      itemClassName="h-full"
      columns={BRAND_LISTING_GRID_COLUMNS}
      rowClassName="pb-4 last:pb-0"
      renderItem={(brand) => (
        <BrandCard
          name={brand.name}
          logoUrl={brand.logoUrl}
          bannerUrl={brand.bannerUrl}
          productCount={brand.productCount}
          description={brand.description}
          href={APP_ROUTES.BRAND_DETAIL(brand.slug)}
          linkComponent={Link}
          imageComponent={Image}
          productCountLabel={(count) => t("card.productCount", { count })}
          viewArchiveLabel={t("card.viewArchive")}
        />
      )}
      loadingMore={loadingMore}
      hasMore={hasMore}
      onLoadMore={loadMore}
      loadingText={t("grid.loadingMore")}
      endText={t("grid.end")}
    />
  );
};

export default BrandListGrid;
