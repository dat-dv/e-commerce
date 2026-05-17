"use client";

import { Pagination } from "@/components/molecules/pagination";
import { ProductGrid } from "@/components/molecules/product-grid";
import { TProduct } from "@/domain/products/types/products.model";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import EmptyState from "@/components/molecules/empty-space";
import { Search, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface IBrandProductListSection {
  brand: TBrand;
  products: TProduct[];
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
}

export function BrandProductListSection({
  brand,
  products,
  currentPage,
  totalPages,
  searchQuery = "",
}: IBrandProductListSection) {
  const [query, setQuery] = useState(searchQuery);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasSearch = searchQuery.length > 0;

  const updateSearch = (nextQuery: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmedQuery = nextQuery.trim();

    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    } else {
      params.delete("q");
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateSearch(query);
  };

  const clearSearch = () => {
    setQuery("");
    updateSearch("");
  };

  return (
    <section className="flex flex-col gap-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-content/10 pb-12">
        <div className="flex flex-col gap-4">
          <h2 className="text-5xl font-black tracking-tighter text-content uppercase">
            {brand.name}{" "}
            <span className="italic font-light text-content/30">Archive</span>
          </h2>
        </div>
        <p className="text-content/50 font-medium max-w-xs text-sm italic">
          {"Experience the pinnacle of craftsmanship through our curated selection of " +
            brand.name +
            " products."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-content/10 bg-surface px-4 py-3 shadow-sm md:flex-row md:items-center"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Search size={18} className="shrink-0 text-content/35" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${brand.name} products`}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-content outline-none placeholder:text-content/35"
          />
          {query ? (
            <button
              type="button"
              onClick={clearSearch}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-content/35 transition-colors hover:bg-content/[0.05] hover:text-content"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
        <button
          type="submit"
          className="h-10 rounded-xl bg-primary px-5 text-xs font-bold uppercase tracking-widest text-white transition-transform active:scale-95"
        >
          Search
        </button>
      </form>

      {products.length > 0 ? (
        <div className="flex flex-col gap-12">
          <ProductGrid products={products} />

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                queryParam="page"
              />
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title={hasSearch ? "No matching products found" : "No products found"}
          description={
            hasSearch
              ? `No ${brand.name} products match "${searchQuery}".`
              : "No products found in this collection yet."
          }
        />
      )}
    </section>
  );
}
