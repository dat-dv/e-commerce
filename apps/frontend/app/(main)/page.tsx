import type { Metadata } from "next";
import { HomeView } from "@/components/organisms/home-view";
import { homepageUseCase } from "@/domain/homepage/use-cases";
import { ProductsProvider } from "@/components/molecules/providers/products-provider";

export const metadata: Metadata = {
  title: "Home",
  description: "E-commerce platform with real-time focus.",
};

export default async function Home() {
  // Fetch dynamic sections on the server
  const sectionsResponse = await homepageUseCase.getSections.execute();

  const initialData = {
    sections:
      sectionsResponse.status === "success" ? sectionsResponse.data : [],
  };

  return (
    <ProductsProvider initState={initialData}>
      <HomeView />
    </ProductsProvider>
  );
}
