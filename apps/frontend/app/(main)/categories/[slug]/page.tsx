import type { Metadata } from "next";

import NotFound from "@/app/not-found";
import { CategoryDetailView } from "@/components/organisms/category-detail-view";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { productsUseCase } from "@/domain/products/use-cases";
import { allSafe } from "@/utils/promise";

import { EProductSort } from "@ecommerce/shared";

interface ProductsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const DEFAULT_SORT = EProductSort.DEFAULT.toString();

const getStringParam = (
  value: string | string[] | undefined,
): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const getNumberParam = (
  value: string | string[] | undefined,
): number | undefined => {
  const raw = getStringParam(value);

  if (!raw) {
    return undefined;
  }

  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseCategoryProductsQuery = (
  searchParams: Record<string, string | string[] | undefined>,
) => {
  return {
    page: getNumberParam(searchParams.page) ?? 1,
    limit: PAGINATION_LIMITS.CATEGORIES,

    brand_id: getStringParam(searchParams.brand_id),

    sort: getStringParam(searchParams.sort) ?? DEFAULT_SORT,

    search: getStringParam(searchParams.search),

    min_price: getNumberParam(searchParams.min_price),

    max_price: getNumberParam(searchParams.max_price),

    rating: getNumberParam(searchParams.rating),
  };
};

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Products - ${slug}`,
    description: `Explore our collection of products in ${slug}.`,
  };
}

export default async function CategoryProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const [{ slug }, rawSearchParams] = await Promise.all([params, searchParams]);

  const query = parseCategoryProductsQuery(rawSearchParams);

  const [productsRes] = await allSafe([
    productsUseCase.getProducts.execute({
      ...query,
      category_slug: slug,
    }),
  ]);

  if (!productsRes) {
    return <NotFound />;
  }

  const isSuccess = productsRes.status === "success";

  const products = isSuccess ? (productsRes.data?.items ?? []) : [];

  const meta = isSuccess ? productsRes.data?.meta : undefined;

  return (
    <CategoryDetailView
      categorySlug={slug}
      products={products}
      totalProducts={meta?.total ?? 0}
      totalPages={meta?.totalPages ?? 1}
    />
  );
}
