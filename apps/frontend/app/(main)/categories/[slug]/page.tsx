import AppContainer from "@/components/atoms/app-container";
import { ProductCard } from "@/components/molecules/product-card";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";

// Mock data for products in this category
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Minimalist Wireless Keyboard",
    category: "Electronics",
    skus: [{ id: "sku-1", price: "$89.00" }],
  },
  {
    id: "2",
    name: "Premium Leather Backpack",
    category: "Accessories",
    skus: [{ id: "sku-2", price: "$120.00" }],
  },
  {
    id: "3",
    name: "Smart Water Bottle",
    category: "Home & Living",
    skus: [{ id: "sku-3", price: "$45.00" }],
  },
  {
    id: "4",
    name: "Noise Cancelling Headphones",
    category: "Electronics",
    skus: [{ id: "sku-4", price: "$299.00" }],
  },
  {
    id: "5",
    name: "Mechanical Gaming Keyboard",
    category: "Electronics",
    skus: [{ id: "sku-5", price: "$129.00" }],
  },
  {
    id: "6",
    name: "Ergonomic Desk Chair",
    category: "Home & Living",
    skus: [{ id: "sku-6", price: "$199.00" }],
  },
  {
    id: "7",
    name: "Wireless Charging Pad",
    category: "Electronics",
    skus: [{ id: "sku-7", price: "$35.00" }],
  },
  {
    id: "8",
    name: "Leather Passport Holder",
    category: "Accessories",
    skus: [{ id: "sku-8", price: "$25.00" }],
  },
];

// This is required for static export with dynamic routes
export async function generateStaticParams() {
  return [
    { slug: "electronics" },
    { slug: "accessories" },
    { slug: "home-living" },
  ];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Capitalize slug for title
  const title = slug
    ? slug.charAt(0).toUpperCase() + slug.slice(1)
    : "Category";

  return (
    <AppContainer className="py-10 flex flex-col gap-8">
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-sm text-content/60">
        <Link
          href={APP_ROUTES.HOME}
          className="hover:text-primary transition-colors"
        >
          Home
        </Link>
        <span>/</span>
        <span className="text-content font-medium">{title}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-content">
            {title}
          </h1>
          <p className="text-sm text-content/60 mt-1">
            Found 8 products in this category
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 bg-content/[0.02] border border-content/[0.05] rounded-xl px-4 py-2.5 text-sm font-bold text-content hover:bg-content/[0.05] transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <select className="bg-content/[0.02] border border-content/[0.05] rounded-xl px-4 py-2.5 text-sm font-bold text-content hover:bg-content/[0.05] transition-colors flex-1 md:flex-initial">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </AppContainer>
  );
}
