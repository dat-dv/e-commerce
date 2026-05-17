import { ProductCard } from "@/components/molecules/product-card";
import { TProduct } from "@/domain/products/types/products.model";

interface ProductGridProps {
  products: TProduct[];
  gridClassName?: string;
}

export function ProductGrid({
  products,
  gridClassName = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6",
}: ProductGridProps) {
  return (
    <div className={gridClassName}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
