import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { cartUseCase } from "@/domain/cart/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { useCartStore } from "./use-cart-store";

export const useUpdateCartQuantity = () => {
  const t = useTranslations("CartPage.toasts");
  const user = useAuthStore((s) => s.user);
  const _addOrUpdateItem = useCartStore((s) => s.addOrUpdateItem);
  const currentItems = useCartStore((s) => s.items);

  return useCallback(
    async (item: TCartItem, quantity: number) => {
      // Get fresh state to know what to revert to
      const existingItem = currentItems.find((i) => i.skuId === item.skuId);
      const previousQuantity = existingItem?.quantity || item.quantity;

      try {
        // Optimistic update
        _addOrUpdateItem(item, quantity);

        if (user) {
          await cartUseCase.updateItem.execute({
            id: item.id,
            quantity,
          });
        }
      } catch {
        // Revert on error
        _addOrUpdateItem(item, previousQuantity);
        toast.error(t("updateFailed"));
      }
    },
    [user, _addOrUpdateItem, currentItems, t],
  );
};
