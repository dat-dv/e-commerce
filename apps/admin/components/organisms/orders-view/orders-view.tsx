"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { FilterBar } from "@/components/molecules/filter-bar";
import { OrdersHeader } from "@/components/molecules/orders-header";
import { OrdersTable } from "@/components/organisms/orders-view/orders-table";
import { APP_ROUTES } from "@/constants/routes";
import { useOrdersView } from "@/hooks/order/use-orders-view";

export const OrdersView = () => {
  const router = useRouter();
  const {
    loading,
    searchQuery,
    page,
    limit,
    total,
    orders,
    setPage,
    setPageSize,
    setSearchQuery,
    setSort,
  } = useOrdersView();

  return (
    <div className="space-y-6">
      <OrdersHeader total={total} />

      <FilterBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchPlaceholder="Search by order ID, customer name or email..."
      />

      <OrdersTable
        orders={orders}
        loading={loading}
        page={page}
        pageSize={limit}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSortChange={setSort}
        onViewDetail={(order) => router.push(APP_ROUTES.ORDER_DETAIL(order.id))}
      />
    </div>
  );
};

OrdersView.displayName = "OrdersView";
