import FlashSaleView from "@/components/organisms/flash-sale";
import { productsUseCase } from "@/domain/products/use-cases";
import { safe } from "@/utils/promise";
import { Metadata } from "next";
import NotFound from "@/app/not-found";

export const metadata: Metadata = {
  title: "Flash Sale | E-Commerce",
  description: "Grab the best deals before they are gone!",
};

import {
  PAGINATION_LIMITS,
  createInitialPaginationMeta,
} from "@/constants/pagination.constant";

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

  const products =
    flashSaleResponse.status === "success" ? flashSaleResponse.data.items : [];
  const meta =
    flashSaleResponse.status === "success"
      ? flashSaleResponse.data.meta
      : createInitialPaginationMeta(PAGINATION_LIMITS.PRODUCTS);

  return <FlashSaleView products={products} meta={meta} />;
}
