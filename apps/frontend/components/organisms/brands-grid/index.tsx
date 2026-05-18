"use client";

import { TBrand } from "@/domain/homepage/types/homepage.model";
import AppContainer from "@/components/atoms/app-container";
import BrandsHeader from "@/components/organisms/brands-grid/brands-header";
import BrandListGrid from "./brands-list";
import { Search } from "lucide-react";
import { IPaginationMeta } from "@/utils/request/request.types";
import DiscoveryCarouselSection from "../discovery-sections";
import { EmptyState } from "@/components/molecules/empty-space";
import { SearchInput } from "@/components/molecules/search-input";
import { usePaginationWithSSRData } from "@/hooks/use-pagination";
import { brandsUseCase } from "@/domain/brands/use-cases";

interface TopBrandsViewProps {
  brands: TBrand[];
  meta: IPaginationMeta;
  searchQuery?: string;
}

const BrandsView = ({ brands, meta, searchQuery = "" }: TopBrandsViewProps) => {
  const {
    items: brandItems,
    loadingMore,
    loading,
    hasMore,
    loadMore,
    loadPage,
    clientQueryParams,
    update,
  } = usePaginationWithSSRData<
    TBrand,
    {
      page: number;
      limit: number;
      search: string;
    }
  >({
    initialItems: brands,
    initialMeta: meta,
    params: {
      page: meta.page,
      limit: meta.limit,
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
    <AppContainer className="flex flex-col gap-12 py-12">
      <BrandsHeader />

      {/* Premium Search Bar Container */}
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
          placeholder="Search brands by name..."
        />
      </div>

      {/* Brands Grid Section */}
      {brandItems.length > 0 ? (
        <BrandListGrid
          brands={brandItems}
          loadingMore={loadingMore}
          hasMore={hasMore}
          loadMore={loadMore}
        />
      ) : (
        <EmptyState
          title="No brands found"
          description={`We couldn't find any brands matching "${clientQueryParams.search}". Try adjusting your search query.`}
          icon={Search}
        />
      )}
      <DiscoveryCarouselSection />
    </AppContainer>
  );
};

export default BrandsView;
