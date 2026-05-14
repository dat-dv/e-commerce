import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCartAdapter } from "../cart/use-cart-adapter";
import { ordersUseCase } from "@/domain/orders";
import { APP_ROUTES } from "@/constants/routes";
import { useCartStore } from "@/hooks/cart/use-cart-store";
import { useAddresses } from "@/hooks/addresses/use-addresses";

export const useCheckoutAdapter = () => {
  const router = useRouter();
  const { selectedItems, totalAmount, clearSelection } = useCartAdapter();
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
    data: ICreateAddressInput,
    editingAddress?: IAddress | null,
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
      const res = await ordersUseCase.placeOrder.execute({
        cartItemIds: selectedSkuIds,
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
  }, [selectedAddressId, selectedSkuIds, clearSelection, router]);

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
