"use client";

import AppContainer from "@/components/atoms/app-container";
import { EmptyState } from "@/components/molecules/empty-space";
import { SearchInput } from "@/components/molecules/search-input";
import BrandsHeader from "@/components/organisms/brands-grid/brands-header";
import { brandsUseCase } from "@/domain/brands/use-cases";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { usePaginationWithSSRData } from "@/hooks/use-pagination";
import { IPaginationMeta } from "@/utils/request/request.types";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import DiscoveryCarouselSection from "../discovery-sections";
import BrandListGrid from "./brands-list";

interface TopBrandsViewProps {
  brands: TBrand[];
  meta: IPaginationMeta;
  searchQuery?: string;
}

const BrandsView = ({ brands, meta, searchQuery = "" }: TopBrandsViewProps) => {
  const t = useTranslations("BrandsPage");
  const {
    items: brandItems,
    loadingMore,
    loading,
    hasMore,
    loadMore,
    loadPage,
    routerState: clientQueryParams,
    update,
  } = usePaginationWithSSRData<
    TBrand,
    {
      page: number;
      limit: number;
      search: string;
    }
  >({
    initialData: {
      items: brands,
      meta,
    },
    defaultParams: {
      search: searchQuery,
    },
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
      <div className="relative mx-auto w-full max-w-2xl">
        <SearchInput
          value={clientQueryParams.search}
          loading={loading}
          onSearch={(value) => {
            const nextParams = {
              page: 1,
              limit: meta.limit,
              search: value,
            };

            update(nextParams);
            void loadPage(1, nextParams, { syncQuery: false });
          }}
          placeholder={t("search.placeholder")}
        />
      </div>
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
            query: clientQueryParams.search,
          })}
          icon={Search}
        />
      )}
      <DiscoveryCarouselSection />
    </AppContainer>
  );
};

export default BrandsView;
