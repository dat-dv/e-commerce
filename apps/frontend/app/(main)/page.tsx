import type { Metadata } from "next";
import { HomeView } from "@/components/organisms/home-view";
import { homepageUseCase } from "@/domain/homepage/use-cases";
import { categoriesUseCase } from "@/domain/categories/use-cases";
import { ProductsProvider } from "@/components/molecules/providers/products-provider";
import { headers } from "next/headers";
import { getLanguageSubdomain } from "@/utils/sub-domain/extract-sub-domain";

export const metadata: Metadata = {
  title: "Home",
  description: "E-commerce platform with real-time focus.",
};

export default async function Home() {
  const headerStore = await headers();
  const host = headerStore.get("host");
  const lang = getLanguageSubdomain(host ?? "");

  // Fetch dynamic sections and categories on the server
  const [sectionsResponse, categoriesResponse] = await Promise.all([
    homepageUseCase.getSections.execute(),
    categoriesUseCase.getCategories.execute(),
  ]);

  const initialData = {
    sections:
      sectionsResponse.status === "success" ? sectionsResponse.data : [],
    categories:
      categoriesResponse.status === "success" ? categoriesResponse.data : [],
    lang,
  };

  return (
    <ProductsProvider initState={initialData}>
      <HomeView />
    </ProductsProvider>
  );
}
