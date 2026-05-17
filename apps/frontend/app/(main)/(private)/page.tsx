import type { Metadata } from "next";
import { HomeView } from "@/components/organisms/home-view";
import { homepageUseCase } from "@/domain/homepage/use-cases";
import { productsUseCase } from "@/domain/products/use-cases";
import { ProductsProvider } from "@/components/molecules/providers/products-provider";
import { safe } from "@/utils/promise";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Home",
  description: "E-commerce platform with real-time focus.",
};

export default async function Home() {
  const [sectionsResponse, flashSaleResponse] = await Promise.all([
    safe(homepageUseCase.getSections.execute()),
    safe(productsUseCase.getFlashSale.execute({ page: 1, limit: 12 })),
  ]);

  if (!sectionsResponse) {
    return notFound();
  }

  const productsInitialData = {
    sections:
      sectionsResponse.status === "success" ? sectionsResponse.data : [],
  };
  const flashSaleProducts =
    flashSaleResponse?.status === "success" ? flashSaleResponse.data.items : [];

  return (
    <ProductsProvider initState={productsInitialData}>
      <HomeView flashSaleProducts={flashSaleProducts} />
    </ProductsProvider>
  );
}
