import type { Metadata } from "next";
import { productsUseCase } from "@/domain/products/use-cases";
import { allSafe } from "@/utils/promise";
import NotFound from "@/app/not-found";
import { ProductsPageProvider } from "@/components/molecules/providers/products-page-provider";
import { SearchView } from "@/components/organisms/search-view";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const q = (sp.search as string) || (sp.q as string) || "";
  return {
    title: `Search results for "${q}"`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const query = (sp.search as string) || (sp.q as string) || "";
  const page = sp.page ? parseInt(sp.page as string) : 1;
  const limit = 24;
  const sort = sp.sort as string;
  const min_price = sp.min_price ? parseInt(sp.min_price as string) : undefined;
  const max_price = sp.max_price ? parseInt(sp.max_price as string) : undefined;

  const [productsRes] = await allSafe([
    productsUseCase.getProducts.execute({
      page,
      limit,
      search: query,
      sort,
      min_price,
      max_price,
    }),
  ]);

  if (!productsRes) return <NotFound />;

  const products =
    productsRes.status === "success" ? productsRes.data?.items || [] : [];
  const total =
    productsRes.status === "success" ? productsRes.data?.meta.total || 0 : 0;

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
        search: query,
        min_price,
        max_price,
      }}
    >
      <SearchView searchQuery={query} />
    </ProductsPageProvider>
  );
}
