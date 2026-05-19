import { BrandDetailView } from "@/components/organisms/brand-detail-view";
import { brandsUseCase } from "@/domain/brands/use-cases";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { allSafe, safe } from "@/utils/promise";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { getTranslations } from "next-intl/server";

interface IBrandDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
  }>;
}

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
  const { page: pageStr, q, category: categorySlug } = await searchParams;
  const currentPage = pageStr ? Math.max(1, parseInt(pageStr, 10)) : 1;
  const searchQuery = q?.trim() || "";

  const [brandResult, productsResult, categoriesResult] = await allSafe([
    brandsUseCase.getBrandBySlug.execute(slug),
    brandsUseCase.getBrandProducts.execute(
      slug,
      currentPage,
      PAGINATION_LIMITS.DEFAULT,
      searchQuery || undefined,
      categorySlug || undefined,
    ),
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
