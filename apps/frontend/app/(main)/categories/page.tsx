import { Metadata } from "next";
import { categoriesUseCase } from "@/domain/categories/use-cases";
import { CategoriesView } from "@/components/organisms/categories-view";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all product categories.",
};

export default async function CategoriesPage() {
  const treeResponse = await categoriesUseCase.getTree.execute();
  const tree = treeResponse.status === "success" ? treeResponse.data : [];

  return <CategoriesView initialTree={tree} />;
}
