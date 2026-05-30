import { Package } from "lucide-react";

interface IProductsHeaderProps {
  total: number;
}

export const ProductsHeader = ({ total }: IProductsHeaderProps) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)] sm:text-3xl">
        Product Management
      </h1>
      <p className="mt-1.5 text-sm text-[var(--muted)]">
        Browse and inspect all products listed on the platform.
      </p>
    </div>
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-2.5 shadow-sm backdrop-blur-xl">
      <Package className="h-5 w-5 text-indigo-400" />
      <span className="text-sm font-semibold text-[var(--app-text)]">
        {total} Total Products
      </span>
    </div>
  </div>
);

ProductsHeader.displayName = "ProductsHeader";
