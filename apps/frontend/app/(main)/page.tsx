import type { Metadata } from "next";
import { HomeView } from "@/components/organisms/home-view";
import { homepageUseCase } from "@/domain/homepage/use-cases";
import { categoriesUseCase } from "@/domain/categories/use-cases";
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
  const headerStore = await headers();
  const host = headerStore.get("host");
  const lang = getLanguageSubdomain(host ?? "");

  const [sectionsResponse, categoriesResponse] = await allSafe([
    homepageUseCase.getSections.execute(),
    categoriesUseCase.getCategories.execute({ page: 1, limit: 10, level: 1 }),
  ]);

  if (!sectionsResponse || !categoriesResponse) {
    return <NotFound />;
  }

  const productsInitialData = {
    sections:
      sectionsResponse.status === "success" ? sectionsResponse.data : [],
    lang,
  };

  const categoriesInitialData = {
    categories:
      categoriesResponse.status === "success"
        ? categoriesResponse.data.items
        : [],
    pagination:
      categoriesResponse.status === "success"
        ? categoriesResponse.data.meta
        : undefined,
  };

  return (
    <ProductsProvider initState={productsInitialData}>
      <HomeView />
    </ProductsProvider>
  );
}
