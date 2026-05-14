import AppContainer from "@/components/atoms/app-container";
import { ProductCard } from "@/components/molecules/product-card";
import { brandsUseCase } from "@/domain/brands/use-cases";
import { Sparkles } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandHero } from "./brand-hero";
import { BrandStory } from "./brand-story";
import { allSafe } from "@/utils/promise";

interface BrandDetailPageProps {
  params: Promise<{
    slug: string;
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
}: BrandDetailPageProps) {
  const { slug } = await params;
  console.log(`🔍 [BrandDetail] Accessing slug: ${slug}`);

  const [brandResult, productsResult] = await Promise.all([
    brandsUseCase.getBrandBySlug.execute(slug),
    brandsUseCase.getBrandProducts.execute(slug, 1, 20),
  ]);

  if (!brandResult?.data || !productsResult?.data) notFound();

  const brand = brandResult.data;
  const productsData = productsResult.data;

  const finalProducts = productsData.items;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <BrandHero brand={brand} />

      <AppContainer className="py-20 flex flex-col gap-32">
        {/* Story Section */}
        <BrandStory brand={brand} />

        {/* Product Collection */}
        <section className="flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-content/10 pb-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                  The Collection
                </span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter text-content uppercase">
                {brand.name}{" "}
                <span className="italic font-light text-content/30">
                  Archive
                </span>
              </h2>
            </div>
            <p className="text-content/50 font-medium max-w-xs text-sm italic">
              {"Experience the pinnacle of craftsmanship through our curated selection of " +
                brand.name +
                " products."}
            </p>
          </div>

          {finalProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {finalProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-content/10 rounded-[3rem]">
              <p className="text-content/40 italic">
                No products found in this collection yet.
              </p>
            </div>
          )}
        </section>
      </AppContainer>
    </div>
  );
}
