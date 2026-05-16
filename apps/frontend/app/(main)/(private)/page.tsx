import type { Metadata } from "next";
import { HomeView } from "@/components/organisms/home-view";
import { homepageUseCase } from "@/domain/homepage/use-cases";
import { ProductsProvider } from "@/components/molecules/providers/products-provider";
import { safe } from "@/utils/promise";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Home",
  description: "E-commerce platform with real-time focus.",
};

export default async function Home() {
  const sectionsResponse = await safe(homepageUseCase.getSections.execute());

  if (!sectionsResponse) {
    return notFound();
  }

  const productsInitialData = {
    sections:
      sectionsResponse.status === "success" ? sectionsResponse.data : [],
  };

  return (
    <ProductsProvider initState={productsInitialData}>
      <HomeView />
    </ProductsProvider>
  );
}
