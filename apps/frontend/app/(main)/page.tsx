import type { Metadata } from "next";
import { HomeView } from "@/components/organisms/home-view";
import { homepageUseCase } from "@/domain/homepage/use-cases";
import { ProductsProvider } from "@/components/molecules/providers/products-provider";
import { headers } from "next/headers";
import { getLanguageSubdomain } from "@/utils/sub-domain/extract-sub-domain";
import { allSafe } from "@/utils/promise";
import NotFound from "../not-found";

export const metadata: Metadata = {
  title: "Home",
  description: "E-commerce platform with real-time focus.",
};

export default async function Home() {
  const [sectionsResponse] = await allSafe([
    homepageUseCase.getSections.execute(),
  ]);

  if (!sectionsResponse) {
    return <NotFound />;
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
