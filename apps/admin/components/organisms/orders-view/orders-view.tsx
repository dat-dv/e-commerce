"use client";

import { SearchInput } from "@ecommerce/ui";
import React from "react";

import { OrderDetailDialog } from "./order-detail-dialog";
import { OrdersHeader } from "./orders-header";
import { OrdersTable } from "./orders-table";
import { useOrdersView } from "./use-orders-view";

export const OrdersView = () => {
  const {
    error,
    loading,
    searchQuery,
    page,
    total,
    totalPages,
    selectedOrder,
    isDetailOpen,
    filteredOrders,
    setPage,
    setSearchQuery,
    setIsDetailOpen,
    handleViewDetail,
  } = useOrdersView();

  return (
    <div className="space-y-6">
      <OrdersHeader total={total} />

      {/* Search bar */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 shadow-xl backdrop-blur-xl">
        <SearchInput
          placeholder="Search by order ID, customer name or email..."
          value={searchQuery}
          onSearch={(q) => setSearchQuery(q)}
          onChange={(q) => setSearchQuery(q)}
          showSubmitButton={false}
          className="w-full"
        />
      </div>

      <OrdersTable
        orders={filteredOrders}
        loading={loading}
        error={error}
        page={page}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onViewDetail={handleViewDetail}
      />

      <OrderDetailDialog
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

OrdersView.displayName = "OrdersView";
