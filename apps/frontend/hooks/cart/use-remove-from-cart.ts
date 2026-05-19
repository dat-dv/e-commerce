import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { cartUseCase } from "@/domain/cart/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { useCartStore } from "./use-cart-store";

export const useRemoveFromCart = () => {
  const t = useTranslations("CartPage.toasts");
  const user = useAuthStore((s) => s.user);
  const _removeItem = useCartStore((s) => s.removeItem);
  const _addOrUpdateItem = useCartStore((s) => s.addOrUpdateItem);

  const removeItem = useCallback(
    async (item: TCartItem) => {
      try {
        _removeItem(item.skuId);

        if (user) {
          await cartUseCase.removeItem.execute(item.id);
        }
      } catch (err) {
        _addOrUpdateItem(item, item.quantity);
        toast.error(t("removeFailed"));
      }
    },
    [user, _removeItem, _addOrUpdateItem, t],
  );

  const removeItems = useCallback(
    async (items: TCartItem[]) => {
      const previousItems = [...items];
      try {
        // Optimistic remove all
        items.forEach((item) => _removeItem(item.skuId));

        if (user) {
          await Promise.all(
            items.map((item) => cartUseCase.removeItem.execute(item.id)),
          );
        }
      } catch (err) {
        // Revert: put all items back
        previousItems.forEach((item) => _addOrUpdateItem(item, item.quantity));
        toast.error(t("removeManyFailed"));
      }
    },
    [user, _removeItem, _addOrUpdateItem, t],
  );

  return { removeItem, removeItems };
};
