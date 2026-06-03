"use client";

import React from "react";

import { FilterBar } from "@/components/molecules/filter-bar";
import { OrdersHeader } from "@/components/molecules/orders-header";
import { OrderDetailDialog } from "@/components/organisms/orders-view/order-detail-dialog";
import { OrdersTable } from "@/components/organisms/orders-view/orders-table";
import { useOrderDetailDialog } from "@/hooks/order/use-order-detail-dialog";
import { useOrdersView } from "@/hooks/order/use-orders-view";

export const OrdersView = () => {
  const {
    error,
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
  const { selectedOrder, isDetailOpen, openOrderDetail, closeOrderDetail } =
    useOrderDetailDialog();

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
        error={error}
        page={page}
        pageSize={limit}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSortChange={setSort}
        onViewDetail={openOrderDetail}
      />

      <OrderDetailDialog
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={closeOrderDetail}
      />
    </div>
  );
};

OrdersView.displayName = "OrdersView";
