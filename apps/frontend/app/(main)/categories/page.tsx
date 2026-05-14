import { Metadata } from "next";
import { CategoriesView } from "@/components/organisms/categories-view";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all product categories.",
};

export default async function CategoriesPage() {
  return <CategoriesView />;
}
