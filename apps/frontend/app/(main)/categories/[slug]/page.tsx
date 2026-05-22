import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import NotFound from "@/app/not-found";
import { CategoryDetailView } from "@/components/organisms/category-detail-view";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { productsUseCase } from "@/domain/products/use-cases";
import { allSafe } from "@/utils/promise";
import { IServerPageProps } from "@/utils/request/request.types";

import { EProductSort } from "@ecommerce/shared";

const DEFAULT_SORT = EProductSort.DEFAULT.toString();

export async function generateMetadata({
  params,
}: IServerPageProps<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations("CategoryDetailPage.metadata");

  return {
    title: t("title", { category: slug }),
    description: t("description", { category: slug }),
  };
}

export default async function CategoryProductsPage({
  params,
  searchParams,
}: IServerPageProps<{ slug: string }>) {
  const [{ slug }, rawSearchParams] = await Promise.all([params, searchParams]);

  const [productsRes] = await allSafe([
    productsUseCase.getProducts.execute({
      category_slug: slug,
      page: Number(rawSearchParams.page) || 1,
      limit: PAGINATION_LIMITS.CATEGORIES,
      brand_id: rawSearchParams.brand_id as string | undefined,
      sort: (rawSearchParams.sort as string | undefined) ?? DEFAULT_SORT,
      search: rawSearchParams.search as string | undefined,
      min_price: rawSearchParams.min_price
        ? Number(rawSearchParams.min_price)
        : undefined,
      max_price: rawSearchParams.max_price
        ? Number(rawSearchParams.max_price)
        : undefined,
      rating: rawSearchParams.rating
        ? Number(rawSearchParams.rating)
        : undefined,
    }),
  ]);

  if (!productsRes) {
    return <NotFound />;
  }

  const initialData =
    productsRes.status === "success" ? productsRes.data : null;

  return <CategoryDetailView categorySlug={slug} initialData={initialData} />;
}
