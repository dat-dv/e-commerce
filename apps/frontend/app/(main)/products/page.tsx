import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore our collection of products.",
};

const FAKE_PRODUCTS = [
  { id: 1, name: "Minimalist T-Shirt", price: "$29.99", emoji: "👕" },
  { id: 2, name: "Sleek Hoodie", price: "$49.99", emoji: "🧥" },
  { id: 3, name: "Classic Sneakers", price: "$79.99", emoji: "👟" },
  { id: 4, name: "Smart Watch", price: "$199.99", emoji: "⌚" },
  { id: 5, name: "Wireless Earbuds", price: "$99.99", emoji: "🎧" },
  { id: 6, name: "Leather Wallet", price: "$39.99", emoji: "👛" },
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
          <div
            key={product.id}
            className="border border-content/5 rounded-2xl p-6 flex flex-col items-center justify-between hover:border-primary/20 transition-colors"
          >
            <div className="text-6xl mb-4">{product.emoji}</div>
            <h2 className="text-lg font-bold text-content">{product.name}</h2>
            <p className="text-content/60 text-sm mb-4">{product.price}</p>
            <Button variant="outline" size="sm" className="w-full">
              Add to Cart
            </Button>
          </div>
        ))}
      </div>
    </AppContainer>
  );
}
