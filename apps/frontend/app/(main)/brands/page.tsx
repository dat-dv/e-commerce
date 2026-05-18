import type { Metadata } from "next";
import { brandsUseCase } from "@/domain/brands/use-cases";
import { safe } from "@/utils/promise";
import BrandsView from "@/components/organisms/brands-grid";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";

export const metadata: Metadata = {
  title: "Brands | Defined Quality",
  description: "Explore our certified partner brands and industry leaders.",
};

interface IBrandsPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function BrandsPage({ searchParams }: IBrandsPageProps) {
  const { q } = await searchParams;
  const searchQuery = q?.trim() || "";

  const response = await safe(
    brandsUseCase.getTopBrands.execute(
      1,
      PAGINATION_LIMITS.BRANDS,
      searchQuery || undefined,
    ),
  );

  const brands = response?.data?.items || [];
  const meta = response?.data?.meta || {
    total: brands.length,
    page: 1,
    limit: PAGINATION_LIMITS.BRANDS,
    totalPages: 1,
  };

  return <BrandsView brands={brands} meta={meta} searchQuery={searchQuery} />;
}
