import AppContainer from "@/components/atoms/app-container";
import { ProductCard } from "@/components/molecules/product-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore our collection of products.",
};

const FAKE_PRODUCTS = [
  {
    id: 1,
    name: "Minimalist T-Shirt",
    price: "$29.99",
    category: "Apparel",
    image_url:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Sleek Hoodie",
    price: "$49.99",
    category: "Apparel",
    image_url:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Classic Sneakers",
    price: "$79.99",
    category: "Footwear",
    image_url:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Smart Watch",
    price: "$199.99",
    category: "Electronics",
    image_url:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Wireless Earbuds",
    price: "$99.99",
    category: "Electronics",
    image_url:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Leather Wallet",
    price: "$39.99",
    category: "Accessories",
    image_url:
      "https://images.unsplash.com/photo-1627123430985-71d464a21886?w=800&auto=format&fit=crop",
  },
];

export default function ProductsPage() {
  return (
    <AppContainer
      size="2xl"
      className="py-16 animate-in fade-in slide-in-from-bottom-6 duration-700"
    >
      <h1 className="text-3xl font-black mb-2 text-content">Our Products</h1>
      <p className="text-content/40 text-sm mb-8">
        Explore our curated collection.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {FAKE_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </AppContainer>
  );
}
