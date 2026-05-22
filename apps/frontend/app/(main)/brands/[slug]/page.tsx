import { BrandDetailView } from "@/components/organisms/brand-detail-view";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { brandsUseCase } from "@/domain/brands/use-cases";
import { allSafe, safe } from "@/utils/promise";
import { IServerPageProps } from "@/utils/request/request.types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

type IBrandDetailPageProps = IServerPageProps<
  { slug: string },
  {
    page?: string;
    search?: string;
    category?: string;
  }
>;

export async function generateMetadata({
  params,
}: IBrandDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations("BrandsPage.metadata");
  const brandResult = await safe(brandsUseCase.getBrandBySlug.execute(slug));
  const brand = brandResult?.data;

  if (!brand) return { title: t("notFoundTitle") };

  return {
    title: `${brand.name} | Defined Quality`,
    description: brand.description,
  };
}

export default async function BrandDetailPage({
  params,
  searchParams,
}: IBrandDetailPageProps) {
  const { slug } = await params;
  const { page: pageStr, search, category: categorySlug } = await searchParams;
  const currentPage = pageStr ? Math.max(1, parseInt(pageStr, 10)) : 1;
  const searchQuery = search?.trim() || "";

  const [brandResult, productsResult, categoriesResult] = await allSafe([
    brandsUseCase.getBrandBySlug.execute(slug),
    brandsUseCase.getBrandProducts.execute(slug, {
      page: currentPage,
      limit: PAGINATION_LIMITS.DEFAULT,
      search: searchQuery || undefined,
      category: categorySlug || undefined,
    }),
    brandsUseCase.getBrandCategories.execute(slug),
  ]);

  if (!brandResult?.data || !productsResult?.data) notFound();
  const brand = brandResult.data;
  const productsData = productsResult.data;
  const categories = categoriesResult?.data || [];

  return (
    <BrandDetailView
      brand={brand}
      products={productsData.items}
      currentPage={currentPage}
      totalPages={productsData.meta.totalPages}
      totalProducts={productsData.meta.total}
      searchQuery={searchQuery}
      categories={categories}
      categorySlug={categorySlug || ""}
    />
  );
}
