"use client";

import { ProductCarousel } from "@/components/molecules/product-carousel";
import { DiscoverySectionSkeleton } from "@/components/organisms/discovery-sections/skeletons";
import { APP_ROUTES } from "@/constants/routes";
import { TProduct } from "@/domain/products/types/products.model";
import { useConfig } from "@/hooks/config/use-config";
import { PackageSearch } from "lucide-react";
import { useTranslations } from "next-intl";

interface SimilarProductsProps {
  similarProducts: TProduct[];
  loadingSimilar: boolean;
}

export const SimilarProducts = ({
  similarProducts,
  loadingSimilar,
}: SimilarProductsProps) => {
  const t = useTranslations("ProductDetailPage");
  const { language } = useConfig();

  return (
    <DiscoverySectionSkeleton
      loading={loadingSimilar}
      total={similarProducts.length}
    >
      <ProductCarousel
        title={t("similarProducts")}
        href={APP_ROUTES.PRODUCTS}
        icon={PackageSearch}
        products={similarProducts}
        rows={1}
        lang={language}
      />
    </DiscoverySectionSkeleton>
  );
};
