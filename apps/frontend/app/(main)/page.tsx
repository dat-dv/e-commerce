import type { Metadata } from "next";
import { HomeView } from "@/components/organisms/home-view";
import { productsUseCase } from "@/domain/products/use-cases";
import { ProductsProvider } from "@/components/molecules/providers/products-provider";

export const metadata: Metadata = {
  title: "Home",
  description: "E-commerce platform with real-time focus.",
};

export default async function Home() {
  // Fetch data on the server
  const flashSaleResponse = await productsUseCase.getFlashSale.execute();
  const recommendedResponse = await productsUseCase.getRecommended.execute();

  const initialData = {
    flashSale: flashSaleResponse.status === "success" ? flashSaleResponse.data : [],
    recommended: recommendedResponse.status === "success" ? recommendedResponse.data : [],
  };

  return (
    <ProductsProvider initState={initialData}>
      <HomeView />
    </ProductsProvider>
  );
}
