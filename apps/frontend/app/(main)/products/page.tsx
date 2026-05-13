import type { Metadata } from "next";
import { productsUseCase } from "@/domain/products/use-cases";
import { categoriesUseCase } from "@/domain/categories/use-cases";
import { ProductsPageProvider } from "@/components/molecules/providers/products-page-provider";
import { ProductsView } from "@/components/organisms/products-view";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore our collection of products.",
};

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const sp = await searchParams;
  const page = sp.page ? parseInt(sp.page as string) : 1;
  const limit = 12;
  const category_id = sp.category_id as string;
  const brand_id = sp.brand_id as string;
  const sort = sp.sort as string;
  const search = sp.search as string;
  const min_price = sp.min_price ? parseInt(sp.min_price as string) : undefined;
  const max_price = sp.max_price ? parseInt(sp.max_price as string) : undefined;

  const [productsRes, categoriesRes] = await Promise.all([
    productsUseCase.getProducts.execute({
      page,
      limit,
      category_id,
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
        category_id,
        sort,
        search,
        min_price,
        max_price,
      }}
    >
      <ProductsView categories={categories} />
    </ProductsPageProvider>
  );
}
