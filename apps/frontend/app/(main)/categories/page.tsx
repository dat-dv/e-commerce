import { Metadata } from "next";
import { categoriesUseCase } from "@/domain/categories/use-cases";
import { CategoriesView } from "@/components/organisms/categories-view";
import { safe } from "@/utils/promise";
import NotFound from "@/app/not-found";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all product categories.",
};

export default async function CategoriesPage() {
  const treeResponse = await safe(categoriesUseCase.getTree.execute());
  if (!treeResponse) return <NotFound />;

  const tree = treeResponse.status === "success" ? treeResponse.data : [];

  return <CategoriesView initialTree={tree} />;
}
