import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "@/hooks/cart/use-cart";
import { ordersUseCase } from "@/domain/orders";
import { APP_ROUTES } from "@/constants/routes";
import { useCartStore } from "@/hooks/cart/use-cart-store";
import { useAddresses } from "@/hooks/addresses/use-addresses";

import {
  TAddress,
  TCreateAddressInput,
} from "@/domain/addresses/types/address.model";

export const useCheckoutAdapter = () => {
  const router = useRouter();
  const { items, selectedItems, totalAmount, clearSelection } = useCart();
  const selectedSkuIds = useCartStore((s) => s.selectedSkuIds);

  const {
    addresses,
    loading: loadingAddresses,
    selectedAddressId,
    setSelectedAddressId,
    addAddress,
    updateAddress,
  } = useAddresses();

  const [placingOrder, setPlacingOrder] = useState(false);

  const handleSubmitAddress = async (
    data: TCreateAddressInput,
    editingAddress?: TAddress | null,
  ) => {
    if (editingAddress) {
      return updateAddress(editingAddress.id, data);
    }
    return addAddress(data);
  };

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
      // Map selectedSkuIds to actual CartItem IDs for the backend
      const cartItemIds = items
        .filter((item) => selectedSkuIds.includes(item.sku_id))
        .map((item) => item.id);

      const res = await ordersUseCase.placeOrder.execute({
        cartItemIds,
        shippingAddressId: selectedAddressId,
      });

      if (res.status === "success") {
        toast.success("Order placed successfully!");
        clearSelection();
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
  }, [selectedAddressId, selectedSkuIds, items, clearSelection, router]);

  return {
    selectedItems,
    totalAmount,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    loading: loadingAddresses,
    placingOrder,
    handlePlaceOrder,
    handleSubmitAddress,
  };
};
