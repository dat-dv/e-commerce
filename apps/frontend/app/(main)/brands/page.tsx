import BrandsView from "@/components/organisms/brands-grid";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { brandsUseCase } from "@/domain/brands/use-cases";
import { safe } from "@/utils/promise";
import { IServerPageProps } from "@/utils/request/request.types";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("BrandsPage.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function BrandsPage({ searchParams }: IServerPageProps) {
  const { search } = await searchParams;

  const response = await safe(
    brandsUseCase.getTopBrands.execute({
      limit: PAGINATION_LIMITS.BRANDS,
      page: 1,
      search: search?.toString() || "",
    }),
  );

  const brands = response?.data || null;

  return <BrandsView initialData={brands} />;
}
