import FlashSaleView from "@/components/organisms/flash-sale";
import { productsUseCase } from "@/domain/products/use-cases";
import { safe } from "@/utils/promise";
import { Metadata } from "next";
import NotFound from "@/app/not-found";

export const metadata: Metadata = {
  title: "Flash Sale | E-Commerce",
  description: "Grab the best deals before they are gone!",
};

interface FlashSalePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FlashSalePage({
  searchParams,
}: FlashSalePageProps) {
  const sp = await searchParams;
  const page = sp.page ? parseInt(sp.page as string) : 1;
  const limit = 24;

  const flashSaleResponse = await safe(
    productsUseCase.getFlashSale.execute({ page, limit }),
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
          page,
          limit,
          totalPages: 0,
        };

  return <FlashSaleView products={products} meta={meta} />;
}
