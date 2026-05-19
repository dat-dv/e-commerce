import ProductDetailClient from "@/components/organisms/product-detail-view";
import MissingProduct from "@/components/molecules/missing-product";
import type { Metadata } from "next";
import { productsUseCase } from "@/domain/products/use-cases";
import { safe } from "@/utils/promise";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ProductDetailPage.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

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
