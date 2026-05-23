import NotFound from "@/app/not-found";
import FlashSaleView from "@/components/organisms/flash-sale";
import { productsUseCase } from "@/domain/products/use-cases";
import { safe } from "@/utils/promise";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("FlashSalePage.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { TProduct } from "@/domain/products/types/products.model";
import { createEmptyPaginatedData } from "@/utils/pagination";

export default async function FlashSalePage() {
  const flashSaleResponse = await safe(
    productsUseCase.getFlashSale.execute({
      page: 1,
      limit: PAGINATION_LIMITS.PRODUCTS,
    }),
  );

  if (!flashSaleResponse) {
    return <NotFound />;
  }

  const initialData =
    flashSaleResponse.status === "success"
      ? flashSaleResponse.data
      : createEmptyPaginatedData<TProduct>({
          page: 1,
          limit: PAGINATION_LIMITS.PRODUCTS,
        });

  return <FlashSaleView initialData={initialData} />;
}
