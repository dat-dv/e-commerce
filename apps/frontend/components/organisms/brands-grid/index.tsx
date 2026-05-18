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
import { useBrandsFilter } from "@/hooks/brands/use-brands-filter";

interface TopBrandsViewProps {
  brands: TBrand[];
  meta: IPaginationMeta;
  searchQuery?: string;
}

const BrandsView = ({ brands, meta, searchQuery = "" }: TopBrandsViewProps) => {
  const { searchValue, setSearchValue, handleSearchSubmit, isPending } =
    useBrandsFilter(searchQuery);

  return (
    <AppContainer className="flex flex-col gap-12 py-12">
      <BrandsHeader />

      {/* Premium Search Bar Container */}
      <div className="relative mx-auto w-full max-w-2xl">
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          onSearch={handleSearchSubmit}
          placeholder="Search brands by name..."
          loading={isPending}
        />
      </div>

      {/* Brands Grid Section */}
      {brands.length > 0 ? (
        <BrandListGrid brands={brands} meta={meta} searchQuery={searchQuery} />
      ) : (
        <EmptyState
          title="No brands found"
          description={`We couldn't find any brands matching "${searchValue}". Try adjusting your search query.`}
          icon={Search}
        />
      )}
      <DiscoveryCarouselSection />
    </AppContainer>
  );
};

export default BrandsView;
