import type { Metadata } from "next";
import { brandsUseCase } from "@/domain/brands/use-cases";
import AppContainer from "@/components/atoms/app-container";
import { Star } from "lucide-react";
import { TopBrandsGrid } from "@/components/organisms/top-brands-grid";
import { IBrand } from "@/domain/homepage/types/homepage.model";

export const metadata: Metadata = {
  title: "Top Brands",
  description: "Explore our certified top brands.",
};

export default async function TopBrandsPage() {
  const response = await brandsUseCase.getTopBrands.execute(1, 20);

  let brands: IBrand[] = [];

  if (response.status === "success" && response.data) {
    brands = response.data.items;
  }

  if (brands.length === 0) {
    brands = [
      { id: "1", name: "Nike", slug: "nike", product_count: 120 },
      { id: "2", name: "Adidas", slug: "adidas", product_count: 85 },
      { id: "3", name: "Apple", slug: "apple", product_count: 45 },
      { id: "4", name: "Samsung", slug: "samsung", product_count: 60 },
      { id: "5", name: "Sony", slug: "sony", product_count: 30 },
      { id: "6", name: "LG", slug: "lg", product_count: 25 },
    ];
  }

  return (
    <div className="py-12">
      <AppContainer>
        <div className="flex items-center gap-3 mb-8">
          <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            Top Brands
          </h1>
        </div>

        <p className="text-slate-500 dark:text-slate-400 mb-12 max-w-2xl">
          Discover the most trusted brands in our store. We guarantee 100%
          authenticity and premium quality from all certified partners.
        </p>

        <TopBrandsGrid brands={brands} />
      </AppContainer>
    </div>
  );
}
