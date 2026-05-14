import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCartAdapter } from "../cart/use-cart-adapter";
import { addressesUseCase } from "@/domain/addresses";
import { ordersUseCase } from "@/domain/orders";
import { IAddress } from "@/domain/addresses/types/address.model";
import { APP_ROUTES } from "@/constants/routes";

export const useCheckoutAdapter = () => {
  const router = useRouter();
  const { selectedItems, selectedSkuIds, totalAmount, clearSelection } = useCartAdapter();
  
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const res = await addressesUseCase.getAddresses.execute();
        if (res.status === "success") {
          setAddresses(res.data || []);
          const defaultAddr = res.data?.find((a) => a.isDefault);
          if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

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
        cartItemIds: selectedSkuIds, // Note: In a real system, these would be CartItem IDs from backend
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
      const message = error instanceof Error ? error.message : "An error occurred while placing your order";
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
    loading,
    placingOrder,
    handlePlaceOrder,
  };
};
