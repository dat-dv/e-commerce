import { type Metadata } from "next";

import { ProductDetailView } from "@/components/organisms/product-detail-view";

export const metadata: Metadata = {
  title: "Product Detail",
};

export default function ProductDetailPage() {
  return <ProductDetailView />;
}
