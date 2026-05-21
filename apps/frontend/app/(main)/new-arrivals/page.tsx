import NewArrivalView from "@/components/organisms/new-arrival/new-arrival-view";
import { productsUseCase } from "@/domain/products/use-cases";
import { safe } from "@/utils/promise";
import { Metadata } from "next";
import NotFound from "@/app/not-found";
import { EProductSort } from "@ecommerce/shared";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { createEmptyPaginatedData } from "@/utils/request/pagination";
import { TProduct } from "@/domain/products/types/products.model";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NewArrivalsPage.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function NewArrivalsPage() {
  const productsResponse = await safe(
    productsUseCase.getProducts.execute({
      page: 1,
      limit: PAGINATION_LIMITS.PRODUCTS,
      sort: EProductSort.DEFAULT.toString(),
    }),
  );

  if (!productsResponse) {
    return <NotFound />;
  }

  const initialData =
    productsResponse.status === "success"
      ? productsResponse.data
      : createEmptyPaginatedData<TProduct>({
          page: 1,
          limit: PAGINATION_LIMITS.PRODUCTS,
        });

  return <NewArrivalView initialData={initialData} />;
}
