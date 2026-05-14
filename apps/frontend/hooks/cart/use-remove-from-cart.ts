import { useCallback } from "react";
import { toast } from "react-toastify";
import { cartUseCase } from "@/domain/cart/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { useCartStore } from "./use-cart-store";

export const useRemoveFromCart = () => {
  const user = useAuthStore((s) => s.user);
  const _removeItem = useCartStore((s) => s.removeItem);

  const removeItem = useCallback(
    async (item: TCartItem) => {
      try {
        if (user) {
          await cartUseCase.removeItem.execute(item.id);
        }
        _removeItem(item.sku_id);
      } catch (err) {
        toast.error("Failed to remove item");
        throw err;
      }
    },
    [user, _removeItem],
  );

  const removeItems = useCallback(
    async (items: TCartItem[]) => {
      try {
        if (user) {
          await Promise.all(
            items.map((item) => cartUseCase.removeItem.execute(item.id)),
          );
        }
        items.forEach((item) => _removeItem(item.sku_id));
      } catch (err) {
        toast.error("Failed to remove items");
        throw err;
      }
    },
    [user, _removeItem],
  );

  return { removeItem, removeItems };
};
