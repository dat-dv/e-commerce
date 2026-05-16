import type { Metadata } from "next";
import { brandsUseCase } from "@/domain/brands/use-cases";
import { safe } from "@/utils/promise";
import TopBrandsView from "@/components/organisms/top-brands-grid";

export const metadata: Metadata = {
  title: "Top Brands",
  description: "Explore our certified top brands.",
};

export default async function TopBrandsPage() {
  const response = await safe(brandsUseCase.getTopBrands.execute(1, 50));
  return <TopBrandsView brands={response?.data?.items || []} />;
}
