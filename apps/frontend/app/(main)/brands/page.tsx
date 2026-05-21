import BrandsView from "@/components/organisms/brands-grid";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { brandsUseCase } from "@/domain/brands/use-cases";
import { safe } from "@/utils/promise";
import { AsyncSearchParams } from "@/utils/request/request.types";
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
  searchParams: AsyncSearchParams;
}

export default async function BrandsPage({ searchParams }: IBrandsPageProps) {
  const sp = await searchParams;
  const searchQuery = String(sp.search || "").trim();

  const response = await safe(
    brandsUseCase.getTopBrands.execute(
      1,
      PAGINATION_LIMITS.BRANDS,
      searchQuery,
    ),
  );

  const brands = response?.data || null;

  return <BrandsView initialData={brands} />;
}
