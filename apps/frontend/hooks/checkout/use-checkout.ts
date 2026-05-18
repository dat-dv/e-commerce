import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "@/hooks/cart/use-cart";
import { ordersUseCase } from "@/domain/orders";
import { APP_ROUTES } from "@/constants/routes";
import { useCartStore } from "@/hooks/cart/use-cart-store";
import { useLoadCart } from "@/hooks/cart/use-load-cart";

export const useCheckout = (selectedAddressId: string | null) => {
  const router = useRouter();
  const { items, selectedItems, totalAmount, clearSelection } = useCart();
  const loadCart = useLoadCart();
  const selectedSkuIds = useCartStore((s) => s.selectedSkuIds);

  const [placingOrder, setPlacingOrder] = useState(false);

  const handlePlaceOrder = useCallback(async () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    if (selectedSkuIds.length === 0) {
      toast.error("No items selected for checkout");
      return;
    }

    setPlacingOrder(true);
    try {
      const cartItemIds = Array.from(
        new Set(
          items
            .filter((item) => selectedSkuIds.includes(item.skuId))
            .map((item) => item.id)
            .filter((id) => !!id),
        ),
      );

      const res = await ordersUseCase.placeOrder.execute({
        cartItemIds,
        shippingAddressId: selectedAddressId,
      });

      if (res.status === "success") {
        toast.success("Order placed successfully!");
        clearSelection();
        await loadCart(); // Synchronize cart state with server after items are evicted
        router.push(APP_ROUTES.ORDERS);
      } else {
        toast.error(res.message || "Failed to place order");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred while placing your order";
      toast.error(message);
    } finally {
      setPlacingOrder(false);
    }
  }, [
    selectedAddressId,
    selectedSkuIds,
    items,
    clearSelection,
    loadCart,
    router,
  ]);

  return {
    selectedItems,
    totalAmount,
    placingOrder,
    handlePlaceOrder,
  };
};
