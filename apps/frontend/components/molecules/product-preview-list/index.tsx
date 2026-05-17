import { SectionHeader } from "@/components/molecules/section-header";
import { TProduct } from "@/domain/products/types/products.model";
import { PackageSearch } from "lucide-react";
import { ReactNode } from "react";
import { ProductCard } from "../product-card";

interface IProductListPreviewProps {
  title: string;
  href: string;
  icon: ReactNode;
  loading: boolean;
  products: TProduct[];
}

export const ProductListPreview = ({
  title,
  href,
  icon,
  loading,
  products,
}: IProductListPreviewProps) => (
  <section className="space-y-5">
    <SectionHeader title={title} href={href} icon={icon} />
    {loading ? (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[3/4] animate-pulse rounded-2xl border border-content/[0.05] bg-content/[0.03]"
          />
        ))}
      </div>
    ) : products.length > 0 ? (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    ) : (
      <div className="rounded-2xl border border-dashed border-content/10 bg-content/[0.02] p-8 text-center">
        <PackageSearch className="mx-auto mb-3 h-7 w-7 text-content/25" />
        <p className="text-sm font-semibold text-content/50">
          Nothing to show yet.
        </p>
      </div>
    )}
  </section>
);
