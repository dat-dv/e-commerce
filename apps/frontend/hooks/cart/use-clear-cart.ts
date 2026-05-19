import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { cartUseCase } from "@/domain/cart/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { useCartStore } from "./use-cart-store";

export const useClearCart = () => {
  const t = useTranslations("CartPage.toasts");
  const user = useAuthStore((s) => s.user);
  const _clearCart = useCartStore((s) => s.clearCart);

  return useCallback(
    async (items?: TCartItem[]) => {
      try {
        if (user && items && items.length > 0) {
          await Promise.all(
            items.map((item) => cartUseCase.removeItem.execute(item.id)),
          );
        }
        _clearCart();
      } catch (err) {
        toast.error(t("clearFailed"));
        throw err;
      }
    },
    [user, _clearCart, t],
  );
};
