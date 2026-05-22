import NotFound from "@/app/not-found";
import { SearchView } from "@/components/organisms/search-view";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { productsUseCase } from "@/domain/products/use-cases";
import { allSafe } from "@/utils/promise";
import { IServerPageProps } from "@/utils/request/request.types";
import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: IServerPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const q = (sp.search as string) || (sp.q as string) || "";
  return {
    title: `Search results for "${q}"`,
  };
}

export default async function SearchPage({ searchParams }: IServerPageProps) {
  const sp = await searchParams;
  const query = (sp.search as string) || (sp.q as string) || "";
  const page = sp.page ? parseInt(sp.page as string) : 1;
  const limit = PAGINATION_LIMITS.PRODUCTS;
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

  const initialData =
    productsRes.status === "success" ? productsRes.data : null;

  return <SearchView searchQuery={query} initialData={initialData} />;
}
