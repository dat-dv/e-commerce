import { ProductCard } from "@/components/molecules/product-card";
import { APP_ROUTES } from "@/constants/routes";
import { TProduct } from "@/domain/products/types/products.model";
import { Sparkles, Link } from "lucide-react";

const RecommendedSection = ({
  products,
  loading,
}: {
  products: TProduct[];
  loading: boolean;
}) => (
  <section className="pt-12 border-t border-content/[0.03]">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles size={20} className="animate-pulse" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">
            Inspiration
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-content tracking-tight">
          Recommended for You
        </h2>
      </div>
      <Link
        href={APP_ROUTES.HOME}
        className="text-sm font-bold text-content/40 hover:text-primary transition-colors flex items-center gap-2"
      >
        VIEW ALL COLLECTIONS
        <div className="w-1 h-1 rounded-full bg-primary" />
      </Link>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {loading
        ? [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-content/[0.02] rounded-[2rem] animate-pulse border border-content/5"
            />
          ))
        : products.map((product: TProduct) => (
            <ProductCard key={product.id} product={product} />
          ))}
    </div>
  </section>
);

export default RecommendedSection;
