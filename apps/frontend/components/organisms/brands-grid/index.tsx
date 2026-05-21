"use client";

import AppContainer from "@/components/atoms/app-container";
import { EmptyState } from "@/components/molecules/empty-space";
import BrandsHeader from "@/components/organisms/brands-grid/brands-header";
import { brandsUseCase } from "@/domain/brands/use-cases";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { usePagination } from "@/hooks/use-pagination";
import { IPaginationMeta } from "@/utils/request/request.types";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import DiscoveryCarouselSection from "../discovery-sections";
import BrandListGrid from "./brands-list";

interface TopBrandsViewProps {
  initialData?: { items: TBrand[]; meta: IPaginationMeta };
}

const BrandsView = ({ initialData }: TopBrandsViewProps) => {
  const t = useTranslations("BrandsPage");
  const {
    items: brandItems,
    loadingMore,
    hasMore,
    loadMore,
    routerState,
  } = usePagination<
    TBrand,
    {
      page: number;
      limit: number;
      search: string;
    }
  >({
    initialData,
    fetchPage: (params) =>
      brandsUseCase.getTopBrands.execute(
        params.page,
        params.limit,
        params.search,
      ),
    getItemKey: (brand) => brand.id,
  });

  return (
    <AppContainer className="flex flex-col gap-12 pb-12">
      <BrandsHeader />
      {brandItems.length > 0 ? (
        <BrandListGrid
          brands={brandItems}
          loadingMore={loadingMore}
          hasMore={hasMore}
          loadMore={loadMore}
        />
      ) : (
        <EmptyState
          title={t("empty.title")}
          description={t("empty.description", {
            query: routerState.search,
          })}
          icon={Search}
        />
      )}
      <DiscoveryCarouselSection />
    </AppContainer>
  );
};

export default BrandsView;
