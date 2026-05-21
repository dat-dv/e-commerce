import { toast } from "@/components/ui/toast";
import { APP_ROUTES } from "@/constants/routes";
import { ordersUseCase } from "@/domain/orders";
import { useCart } from "@/hooks/cart/use-cart";
import { useCartStore } from "@/hooks/cart/use-cart-store";
import { useLoadCart } from "@/hooks/cart/use-load-cart";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const useCheckout = (selectedAddressId: string | null) => {
  const t = useTranslations("CheckoutPage.toasts");
  const router = useRouter();
  const { items, selectedItems, totalAmount, clearSelection } = useCart();
  const loadCart = useLoadCart();
  const selectedSkuIds = useCartStore((s) => s.selectedSkuIds);
  const setItems = useCartStore((s) => s.setItems);

  const [placingOrder, setPlacingOrder] = useState(false);

  const handlePlaceOrder = useCallback(async () => {
    if (!selectedAddressId) {
      toast.error(t("selectAddress"));
      return;
    }

    if (selectedSkuIds.length === 0) {
      toast.error(t("noItems"));
      return;
    }

    setPlacingOrder(true);
    try {
      const latestItems = (await loadCart()) ?? items;
      const latestSelectedSkuIds = selectedSkuIds.filter((skuId) =>
        latestItems.some((item) => item.skuId === skuId),
      );

      if (latestSelectedSkuIds.length === 0) {
        toast.error(t("noItems"));
        return;
      }

      const cartItemIds = Array.from(
        new Set(
          latestItems
            .filter((item) => latestSelectedSkuIds.includes(item.skuId))
            .map((item) => item.id)
            .filter((id) => !!id),
        ),
      );

      const res = await ordersUseCase.placeOrder.execute({
        cartItemIds,
        shippingAddressId: selectedAddressId,
      });

      if (res.status === "success") {
        toast.success(t("success"));
        setItems(latestItems.filter((item) => !cartItemIds.includes(item.id)));
        clearSelection();
        await loadCart(); // Synchronize cart state with server after items are evicted
        router.push(APP_ROUTES.ORDERS);
      } else {
        toast.error(res.message || t("placeFailed"));
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("unknownError");
      toast.error(message);
    } finally {
      setPlacingOrder(false);
    }
  }, [
    selectedAddressId,
    selectedSkuIds,
    items,
    setItems,
    clearSelection,
    loadCart,
    router,
    t,
  ]);

  return {
    selectedItems,
    totalAmount,
    placingOrder,
    handlePlaceOrder,
  };
};
