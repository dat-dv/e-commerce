import type { Metadata } from "next";
import { productsUseCase } from "@/domain/products/use-cases";
import { categoriesUseCase } from "@/domain/categories/use-cases";
import { ProductsPageProvider } from "@/components/molecules/providers/products-page-provider";
import { ProductsView } from "@/components/organisms/products-view";

interface ProductsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

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
  const { slug } = await params;
  const sp = await searchParams;

  const page = sp.page ? parseInt(sp.page as string) : 1;
  const limit = 56;
  const brand_id = sp.brand_id as string;
  const sort = sp.sort as string;
  const search = sp.search as string;
  const min_price = sp.min_price ? parseInt(sp.min_price as string) : undefined;
  const max_price = sp.max_price ? parseInt(sp.max_price as string) : undefined;

  const [productsRes, categoriesRes] = await Promise.all([
    productsUseCase.getProducts.execute({
      page,
      limit,
      category_slug: slug,
      brand_id,
      sort,
      min_price,
      max_price,
      search,
    }),
    categoriesUseCase.getTree.execute(),
  ]);

  const products =
    productsRes.status === "success" ? productsRes.data?.items || [] : [];
  const total =
    productsRes.status === "success" ? productsRes.data?.meta.total || 0 : 0;
  const categories =
    categoriesRes.status === "success" ? categoriesRes.data || [] : [];

  return (
    <ProductsPageProvider
      initState={{
        products,
        total,
        currentPage: page,
        totalPages:
          productsRes.status === "success"
            ? productsRes.data?.meta.totalPages || 1
            : 1,
        sort: sort || "newest",
        search,
        min_price,
        max_price,
      }}
    >
      <ProductsView categories={categories} categorySlug={slug} />
    </ProductsPageProvider>
  );
}
