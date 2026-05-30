import { Package } from "lucide-react";

interface IOrdersHeaderProps {
  total: number;
}

export const OrdersHeader = ({ total }: IOrdersHeaderProps) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)] sm:text-3xl">
        Order Management
      </h1>
      <p className="mt-1.5 text-sm text-[var(--muted)]">
        Monitor and manage all customer orders across the platform.
      </p>
    </div>
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-2.5 shadow-sm backdrop-blur-xl">
      <Package className="h-5 w-5 text-indigo-400" />
      <span className="text-sm font-semibold text-[var(--app-text)]">
        {total} Total Orders
      </span>
    </div>
  </div>
);

OrdersHeader.displayName = "OrdersHeader";
