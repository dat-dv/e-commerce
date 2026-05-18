"use client";

import { TBrand } from "@/domain/homepage/types/homepage.model";
import AppContainer from "@/components/atoms/app-container";
import BrandsHeader from "@/components/organisms/brands-grid/brands-header";
import BrandListGrid from "./brands-list";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useCallback, useTransition, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { IPaginationMeta } from "@/utils/request/request.types";
import DiscoveryCarouselSection from "../discovery-sections";
import { EmptyState } from "@/components/molecules/empty-space";

interface TopBrandsViewProps {
  brands: TBrand[];
  meta: IPaginationMeta;
  searchQuery?: string;
}

const BrandsView = ({ brands, meta, searchQuery = "" }: TopBrandsViewProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [isPending, startTransition] = useTransition();

  // Sync state if searchQuery prop changes (e.g. back navigation)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchValue(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = value.trim();
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  return (
    <AppContainer className="flex flex-col gap-12 py-12">
      <BrandsHeader />

      {/* Premium Search Bar Container */}
      <div className="relative mx-auto w-full max-w-2xl">
        <div className="group relative flex items-center rounded-2xl border border-content/10 bg-content/[0.02] p-1.5 transition-all duration-300 focus-within:border-primary/30 focus-within:bg-content/[0.04] focus-within:shadow-[0_0_30px_-5px_rgba(var(--primary-rgb),0.15)]">
          <div className="pl-4 text-content/30 transition-colors group-focus-within:text-primary">
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit(searchValue);
              }
            }}
            onBlur={() => handleSearchSubmit(searchValue)}
            placeholder="Search brands by name..."
            className="w-full bg-transparent px-3 py-2.5 text-sm font-semibold text-content outline-none placeholder:text-content/30"
          />
          {searchValue && (
            <button
              onClick={() => {
                setSearchValue("");
                handleSearchSubmit("");
              }}
              className="mr-2 rounded-lg bg-content/5 px-2.5 py-1 text-xs font-bold text-content/60 transition-colors hover:bg-content/10 hover:text-content"
            >
              Clear
            </button>
          )}
        </div>
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
