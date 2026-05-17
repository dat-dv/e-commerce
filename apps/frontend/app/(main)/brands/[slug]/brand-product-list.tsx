"use client";

import { ProductCard } from "@/components/molecules/product-card";
import { Pagination } from "@/components/molecules/pagination";
import { TProduct } from "@/domain/products/types/products.model";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    // Scroll: false prevents the page from jumping abruptly to top, creating a smoother transition.
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="flex flex-col gap-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-content/10 pb-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              The Collection
            </span>
          </div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-content/10 rounded-[3rem]">
          <p className="text-content/40 italic">
            No products found in this collection yet.
          </p>
        </div>
      )}
    </section>
  );
}
