import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore our collection of products.",
};

export default function ProductsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-4xl font-black mb-4">Our Products</h1>
      <p className="text-content/60 text-lg">
        Product listing is coming soon...
      </p>
    </div>
  );
}
