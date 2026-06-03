import { ProductCard } from "@/components/molecules/product-card";
import { PRODUCT_LISTING_GRID_CLASS_NAME } from "@/constants/grid-presets";
import { TProduct } from "@/domain/products/types/products.model";
import { cn } from "@/utils/cn";

interface ProductGridProps {
  products: TProduct[];
  loading?: boolean;
  skeletonCount?: number;
  gridClassName?: string;
}

export function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
  gridClassName = PRODUCT_LISTING_GRID_CLASS_NAME,
}: ProductGridProps) {
  const isInitialLoading = loading && products.length === 0;

  if (isInitialLoading) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            className="border-content/[0.04] bg-content/[0.02] flex aspect-[3/4] animate-pulse flex-col justify-end gap-3 rounded-3xl border p-4"
          >
            <div className="bg-content/5 h-4 w-3/4 animate-pulse rounded-full" />
            <div className="bg-content/5 h-3 w-1/2 animate-pulse rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        gridClassName,
        "transition-all duration-300",
        loading && "pointer-events-none opacity-40 blur-[1px]",
      )}
    >
      {products.map((product, idx) => (
        <ProductCard key={product.id + idx} product={product} />
      ))}
    </div>
  );
}
