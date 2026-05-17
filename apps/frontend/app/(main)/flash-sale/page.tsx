import FlashSaleView from "@/components/organisms/flash-sale";
import { productsUseCase } from "@/domain/products/use-cases";
import { safe } from "@/utils/promise";
import { Metadata } from "next";
import NotFound from "@/app/not-found";

export const metadata: Metadata = {
  title: "Flash Sale | E-Commerce",
  description: "Grab the best deals before they are gone!",
};

export default async function FlashSalePage() {
  const flashSaleResponse = await safe(
    productsUseCase.getFlashSale.execute({ page: 1, limit: 24 }),
  );

  if (!flashSaleResponse) {
    return <NotFound />;
  }

  const products =
    flashSaleResponse.status === "success" ? flashSaleResponse.data.items : [];
  const meta =
    flashSaleResponse.status === "success"
      ? flashSaleResponse.data.meta
      : {
          total: 0,
          page: 1,
          limit: 24,
          totalPages: 0,
        };

  return <FlashSaleView products={products} meta={meta} />;
}
