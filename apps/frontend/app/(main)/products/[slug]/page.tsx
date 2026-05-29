import { MissingProduct } from "@ecommerce/ui";
import ProductDetailClient from "@/components/organisms/product-detail-view";

import type { Metadata } from "next";
import { productsUseCase } from "@/domain/products/use-cases";
import { safe } from "@/utils/promise";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";

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
    const t = await getTranslations("Common.missingProduct");
    const labels = {
      title: t("title"),
      description: t("description"),
      continueShopping: t("continueShopping"),
      goBack: t("goBack"),
    };
    const suggestedRoutes = [
      { label: t("browseProducts"), href: APP_ROUTES.PRODUCTS },
      { label: t("viewCart"), href: APP_ROUTES.CART },
      { label: t("backToHome"), href: APP_ROUTES.HOME },
    ];

    return (
      <MissingProduct
        labels={labels}
        suggestedRoutes={suggestedRoutes}
        continueShoppingHref={APP_ROUTES.PRODUCTS}
        linkComponent={Link}
      />
    );
  }

  return <ProductDetailClient product={backendProduct} />;
}
