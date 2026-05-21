import { ProductCard } from "@/components/molecules/product-card";
import { PRODUCT_LISTING_GRID_CLASS_NAME } from "@/components/molecules/virtual-grid/grid-presets";
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
            className="aspect-[3/4] rounded-3xl border border-content/[0.04] bg-content/[0.02] p-4 flex flex-col justify-end gap-3 animate-pulse"
          >
            <div className="h-4 bg-content/5 rounded-full w-3/4 animate-pulse" />
            <div className="h-3 bg-content/5 rounded-full w-1/2 animate-pulse" />
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
        loading && "opacity-40 pointer-events-none scale-[0.99] blur-[1px]",
      )}
    >
      {products.map((product, idx) => (
        <ProductCard key={product.id + idx} product={product} />
      ))}
    </div>
  );
}
