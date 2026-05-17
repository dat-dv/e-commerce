import AppContainer from "@/components/atoms/app-container";
import { brandsUseCase } from "@/domain/brands/use-cases";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandHero } from "./brand-hero";
import { BrandStory } from "./brand-story";
import { BrandProductListSection } from "./brand-product-list";
import { allSafe } from "@/utils/promise";

interface BrandDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: BrandDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: brand } = await brandsUseCase.getBrandBySlug.execute(slug);

  if (!brand) return { title: "Brand Not Found" };

  return {
    title: `${brand.name} | Defined Quality`,
    description: brand.description,
  };
}

export default async function BrandDetailPage({
  params,
  searchParams,
}: BrandDetailPageProps) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const currentPage = pageStr ? Math.max(1, parseInt(pageStr, 10)) : 1;

  console.log(`🔍 [BrandDetail] Accessing slug: ${slug}, page: ${currentPage}`);

  const [brandResult, productsResult] = await allSafe([
    brandsUseCase.getBrandBySlug.execute(slug),
    brandsUseCase.getBrandProducts.execute(slug, currentPage, 20),
  ]);

  if (!brandResult?.data || !productsResult?.data) notFound();

  const brand = brandResult.data;
  const productsData = productsResult.data;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <BrandHero brand={brand} />
      <AppContainer className="py-20 flex flex-col gap-32">
        {/* Story Section */}
        <BrandStory brand={brand} />

        {/* Product Collection with interactive pagination */}
        <BrandProductListSection
          brand={brand}
          products={productsData.items}
          currentPage={currentPage}
          totalPages={productsData.meta.totalPages}
        />
      </AppContainer>
    </div>
  );
}
