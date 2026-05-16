import type { Metadata } from "next";
import { brandsUseCase } from "@/domain/brands/use-cases";
import AppContainer from "@/components/atoms/app-container";
import { TopBrandsGrid } from "@/components/organisms/top-brands-grid";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import TopBrandsHeader from "./top-brands-header";

export const metadata: Metadata = {
  title: "Top Brands",
  description: "Explore our certified top brands.",
};

export default async function TopBrandsPage() {
  const response = await brandsUseCase.getTopBrands.execute(1, 20);

  let brands: TBrand[] = [];

  if (response.status === "success" && response.data) {
    brands = response.data.items;
  }

  if (brands.length === 0) {
    brands = [
      { id: "1", name: "Nike", slug: "nike", productCount: 120 },
      { id: "2", name: "Adidas", slug: "adidas", productCount: 85 },
      { id: "3", name: "Apple", slug: "apple", productCount: 45 },
      { id: "4", name: "Samsung", slug: "samsung", productCount: 60 },
      { id: "5", name: "Sony", slug: "sony", productCount: 30 },
      { id: "6", name: "LG", slug: "lg", productCount: 25 },
    ];
  }

  return (
    <div className="py-12">
      <AppContainer>
        <TopBrandsHeader />
        <TopBrandsGrid brands={brands} />
      </AppContainer>
    </div>
  );
}
