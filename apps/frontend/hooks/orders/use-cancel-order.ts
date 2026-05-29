import { toast } from "@/components/atoms/toast";
import { TOAST_KEYS } from "@/constants/toast.constant";
import { ordersUseCase } from "@/domain/orders";
import { useCallback, useTransition } from "react";

export const useCancelOrder = () => {
  const [isPending, startTransition] = useTransition();

  const cancelOrder = useCallback((orderId: string, onSuccess?: () => void) => {
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          const response = await ordersUseCase.cancelOrder.execute(orderId);

          if (response.status === "success") {
            toast.success("Order cancelled successfully", {
              id: TOAST_KEYS.ORDER_CANCEL(orderId),
            });
            onSuccess?.();
          }
          resolve();
        } catch (error) {
          console.error("Failed to cancel order:", error);
          toast.error("Failed to cancel order. Please try again.");
          reject(error);
        }
      });
    });
  }, []);

  return {
    cancelOrder,
    isCancelling: isPending,
  };
};
