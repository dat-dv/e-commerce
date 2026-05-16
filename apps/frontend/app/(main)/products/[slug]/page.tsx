import ProductDetailClient from "@/components/organisms/product-detail-view";
import MissingProduct from "@/components/molecules/missing-product";
import type { Metadata } from "next";
import { productsUseCase } from "@/domain/products/use-cases";
import { safe } from "@/utils/promise";

export const metadata: Metadata = {
  title: "Product Details",
  description: "View product details.",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const response = await safe(productsUseCase.getProductById.execute(slug));
  const backendProduct = response?.data;

  if (!backendProduct?.id) {
    return <MissingProduct />;
  }

  return <ProductDetailClient product={backendProduct} />;
}
