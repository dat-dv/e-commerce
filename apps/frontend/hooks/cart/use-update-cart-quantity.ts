import { useCallback } from "react";
import { toast } from "react-toastify";
import { cartUseCase } from "@/domain/cart/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { useCartStore } from "./use-cart-store";

export const useUpdateCartQuantity = () => {
  const user = useAuthStore((s) => s.user);
  const _updateQuantity = useCartStore((s) => s.updateQuantity);

  return useCallback(
    async (item: TCartItem, quantity: number) => {
      try {
        if (user) {
          await cartUseCase.updateItem.execute({
            id: item.id,
            quantity,
          });
        }
        _updateQuantity(item.sku_id, quantity);
      } catch (err) {
        toast.error("Failed to update quantity");
        throw err;
      }
    },
    [user, _updateQuantity],
  );
};
