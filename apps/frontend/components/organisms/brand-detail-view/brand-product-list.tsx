"use client";

import { Pagination } from "@/components/molecules/pagination";
import { ProductGrid } from "@/components/molecules/product-grid";
import { TProduct } from "@/domain/products/types/products.model";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import EmptyState from "@/components/molecules/empty-space";

interface IBrandProductListSection {
  brand: TBrand;
  products: TProduct[];
  currentPage: number;
  totalPages: number;
}

export function BrandProductListSection({
  brand,
  products,
  currentPage,
  totalPages,
}: IBrandProductListSection) {
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
          title="No products found"
          description="No products found in this collection yet."
        />
      )}
    </section>
  );
}
