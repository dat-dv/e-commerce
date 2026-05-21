import NotFound from "@/app/not-found";
import NewArrivalView from "@/components/organisms/new-arrival/new-arrival-view";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { productsUseCase } from "@/domain/products/use-cases";
import { safe } from "@/utils/promise";
import { AsyncSearchParams } from "@/utils/request/request.types";
import { EProductSort } from "@ecommerce/shared";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NewArrivalsPage.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}
interface NewArrivalsPageProps {
  searchParams: AsyncSearchParams;
}
export default async function NewArrivalsPage({
  searchParams,
}: NewArrivalsPageProps) {
  const p = await searchParams;
  const page = Number(p.page) || 1;
  const limit = Number(p.limit) || PAGINATION_LIMITS.PRODUCTS;
  const search = String(p.search || "");

  const productsResponse = await safe(
    productsUseCase.getProducts.execute({
      page,
      limit,
      sort: EProductSort.DEFAULT.toString(),
      search: search,
    }),
  );

  if (!productsResponse) {
    return <NotFound />;
  }

  const initialData =
    productsResponse.status === "success" ? productsResponse.data : null;

  return <NewArrivalView initialData={initialData} />;
}
