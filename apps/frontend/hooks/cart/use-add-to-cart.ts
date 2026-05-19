import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/toast";
import { usePathname, useRouter } from "next/navigation";
import { cartUseCase } from "@/domain/cart/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { APP_ROUTES, CALLBACK_URL_KEY } from "@/constants/routes";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { useCartStore } from "./use-cart-store";

export const useAddToCart = () => {
  const t = useTranslations("CartPage.toasts");
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const pathname = usePathname();
  const _addOrUpdateItem = useCartStore((s) => s.addOrUpdateItem);
  const currentItems = useCartStore((s) => s.items);

  return useCallback(
    async (item: Omit<TCartItem, "quantity">, quantity: number) => {
      const existingItem = currentItems.find((i) => i.skuId === item.skuId);
      const previousQuantity = existingItem?.quantity || 0;
      const nextQuantity = previousQuantity + quantity;

      try {
        if (user) {
          const itemToUpdate = existingItem
            ? { ...item, id: existingItem.id }
            : item;
          _addOrUpdateItem(itemToUpdate, nextQuantity);

          const response = await cartUseCase.addItem.execute({
            skuId: item.skuId,
            quantity,
          });

          if (response.data) {
            _addOrUpdateItem({ ...item, id: response.data.id }, nextQuantity);
          }
        } else {
          const callbackUrl = encodeURIComponent(pathname);
          router.push(
            `${APP_ROUTES.SIGN_IN}?${CALLBACK_URL_KEY}=${callbackUrl}`,
          );
          toast.info(t("signInRequired"));
        }
      } catch {
        _addOrUpdateItem(item, previousQuantity);
        toast.error(t("addFailed"));
      }
    },
    [currentItems, user, _addOrUpdateItem, pathname, router, t],
  );
};
