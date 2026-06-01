import { Package } from "lucide-react";

import { PageHeader } from "@/components/molecules/page-header";

interface IProductsHeaderProps {
  total: number;
}

export const ProductsHeader = ({ total }: IProductsHeaderProps) => (
  <PageHeader
    title="Product Management"
    description="Browse and inspect all products listed on the platform."
  >
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-2.5 shadow-sm backdrop-blur-xl">
      <Package className="text-primary h-5 w-5" />
      <span className="text-sm font-semibold text-[var(--app-text)]">
        {total} Total Products
      </span>
    </div>
  </PageHeader>
);

ProductsHeader.displayName = "ProductsHeader";
