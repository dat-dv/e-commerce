import ProductDetailClient from "@/components/molecules/product-detail-client";
import MissingProduct from "@/components/molecules/missing-product";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Details",
  description: "View product details.",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <MissingProduct />;
  }

  const product = {
    id: id,
    name: "Demo Premium Product #" + id,
    price: 1200000,
    original_price: 1500000,
    discount_percent: 20,
    category: "Electronics / Devices",
    description:
      "This is the detailed description for the premium demo product. It features a luxurious design with high-quality materials, maximizing user experience with a 12-month official warranty.",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop",
    ],
    colors: ["Black", "White", "Slate"],
    rating: 4.8,
    reviews_count: 256,
  };

  return <ProductDetailClient product={product} />;
}
