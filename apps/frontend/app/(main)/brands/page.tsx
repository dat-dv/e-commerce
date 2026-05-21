import BrandsView from "@/components/organisms/brands-grid";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { brandsUseCase } from "@/domain/brands/use-cases";
import { safe } from "@/utils/promise";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("BrandsPage.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

interface IBrandsPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function BrandsPage({ searchParams }: IBrandsPageProps) {
  const { search } = await searchParams;
  const searchQuery = search?.trim() || "";

  const response = await safe(
    brandsUseCase.getTopBrands.execute(
      1,
      PAGINATION_LIMITS.BRANDS,
      searchQuery,
    ),
  );

  const brands = response?.data;

  return <BrandsView initialData={brands} />;
}
