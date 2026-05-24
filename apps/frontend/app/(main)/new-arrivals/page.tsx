import NewArrivalView from "@/components/organisms/new-arrival/new-arrival-view";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { productsUseCase } from "@/domain/products/use-cases";
import { safe } from "@/utils/promise";
import { IServerPageProps } from "@/utils/request/request.types";
import { EProductSort } from "@ecommerce/shared";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NewArrivalsPage.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default async function NewArrivalsPage({
  searchParams,
}: IServerPageProps) {
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
    notFound();
  }

  const initialData =
    productsResponse.status === "success" ? productsResponse.data : null;

  return <NewArrivalView initialData={initialData} />;
}
