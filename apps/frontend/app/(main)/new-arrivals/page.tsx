import NewArrivalView from "@/components/organisms/new-arrival/new-arrival-view";
import { productsUseCase } from "@/domain/products/use-cases";
import { safe } from "@/utils/promise";
import { Metadata } from "next";
import NotFound from "@/app/not-found";
import { EProductSort } from "@ecommerce/shared";
import {
  PAGINATION_LIMITS,
  createInitialPaginationMeta,
} from "@/constants/pagination.constant";

export const metadata: Metadata = {
  title: "New Arrivals | E-Commerce",
  description:
    "Discover the latest products that have just arrived at our store.",
};

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

  const products =
    productsResponse.status === "success" ? productsResponse.data.items : [];
  const meta =
    productsResponse.status === "success"
      ? productsResponse.data.meta
      : createInitialPaginationMeta(PAGINATION_LIMITS.PRODUCTS);

  return <NewArrivalView products={products} meta={meta} />;
}
