import { TOrder } from "@/domain/orders/types/order.model";
import type { Key } from "react-aria-components";

export interface AdminOrderExpansionProps {
  expandedOrderIds: Set<Key>;
  onExpandedToggle: (orderId: string) => void;
}

export interface AdminOrderActionProps {
  updatingId: string | null;
  onCopy: (text: string) => void;
  onStatusUpdate: (orderId: string, newStatus: number) => void;
}

export interface AdminOrderRowProps
  extends
    AdminOrderActionProps,
    Omit<AdminOrderExpansionProps, "expandedOrderIds"> {
  order: TOrder;
  isExpanded: boolean;
}
