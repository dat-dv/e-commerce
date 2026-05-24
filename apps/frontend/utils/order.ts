import { EOrderStatus } from "@ecommerce/shared";

export const getOrderStatusLabel = (status: EOrderStatus | number) => {
  switch (status) {
    case EOrderStatus.PENDING:
      return "pending";
    case EOrderStatus.PAID:
      return "paid";
    case EOrderStatus.SHIPPING:
      return "shipping";
    case EOrderStatus.DELIVERED:
      return "delivered";
    case EOrderStatus.CANCEL_REQUESTED:
      return "cancelRequested";
    case EOrderStatus.CANCEL_PROCESSING:
      return "cancelProcessing";
    case EOrderStatus.CANCELLED:
      return "cancelled";
    case EOrderStatus.RETURN_REQUESTED:
      return "returnRequested";
    case EOrderStatus.RETURN_PROCESSING:
      return "returnProcessing";
    case EOrderStatus.RETURNED:
      return "returned";
    case EOrderStatus.RETURN_REJECTED:
      return "returnRejected";
    default:
      return "pending";
  }
};
