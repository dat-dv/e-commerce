"use client";

import { EOrderStatus } from "@ecommerce/shared";
import { toast, useLoadOnce } from "@ecommerce/ui";
import { useCallback, useMemo, useState, useTransition } from "react";

import { ADMIN_PERMISSIONS } from "@/constants/permissions";
import { adminOrderUseCase } from "@/domain/order";
import type { IAdminCustomerOrder } from "@/domain/user/types/user.model";
import { useAdminUserStore } from "@/store/user";
import { hasPermission } from "@/utils/permissions";

const ORDER_STATUS_OPTIONS = Object.values(EOrderStatus).filter(
  (status): status is EOrderStatus => typeof status === "number",
);

const TERMINAL_ORDER_STATUSES = [
  EOrderStatus.DELIVERED,
  EOrderStatus.CANCELLED,
  EOrderStatus.RETURNED,
];

export const useOrderDetail = (orderId: string | null) => {
  const [order, setOrder] = useState<IAdminCustomerOrder | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<EOrderStatus | "">("");
  const [loading, startLoadingTransition] = useTransition();
  const [isUpdating, startUpdatingTransition] = useTransition();
  const user = useAdminUserStore((state) => state.user);

  const canUpdateStatus = hasPermission(user, ADMIN_PERMISSIONS.UPDATE_ORDER);

  const loadOrder = useCallback(() => {
    if (!orderId) {
      toast.error("Missing order id.");
      return;
    }

    startLoadingTransition(async () => {
      try {
        const response = await adminOrderUseCase.getOrder.execute(orderId);
        setOrder(response);
        setSelectedStatus("");
      } catch {
        toast.error("Failed to load order detail.");
      }
    });
  }, [orderId]);

  useLoadOnce(loadOrder, !!orderId);

  const availableStatuses = useMemo(() => {
    if (!order) return [];
    if (TERMINAL_ORDER_STATUSES.includes(order.status as EOrderStatus)) {
      return [];
    }

    return ORDER_STATUS_OPTIONS;
  }, [order]);

  const updateStatus = useCallback(() => {
    if (!order || selectedStatus === "") return;
    if (selectedStatus <= order.status) {
      toast.error("Please select a status after the current status.");
      return;
    }

    startUpdatingTransition(async () => {
      try {
        await adminOrderUseCase.updateStatus.execute({
          id: order.id,
          status: selectedStatus,
        });
        toast.success("Order status updated.");
        loadOrder();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update order status.";
        toast.error(message);
      }
    });
  }, [loadOrder, order, selectedStatus]);

  return {
    order,
    loading,
    isUpdating,
    canUpdateStatus,
    selectedStatus,
    setSelectedStatus,
    availableStatuses,
    updateStatus,
    reload: loadOrder,
  };
};
