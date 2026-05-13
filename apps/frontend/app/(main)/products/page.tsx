import AppContainer from "@/components/atoms/app-container";
import { ProductCard } from "@/components/molecules/product-card";
import type { Metadata } from "next";
import { productsUseCase } from "@/domain/products/use-cases";
import ProductsHeader from "./products-header";
import { TProduct } from "@/domain/products/types/products.model";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore our collection of products.",
};

export default async function ProductsPage() {
  const response = await productsUseCase.getProducts.execute({ limit: 12 });

  let products: TProduct[] = [];
  if (response.status === "success" && response.data?.items) {
    products = response.data.items;
  }

  return (
    <AppContainer size="2xl" className="py-16">
      <ProductsHeader />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            No products found.
          </p>
        </div>
      )}
    </AppContainer>
  );
}
