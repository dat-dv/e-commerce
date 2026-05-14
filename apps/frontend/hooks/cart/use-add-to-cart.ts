import { useCallback } from "react";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import { cartUseCase } from "@/domain/cart/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { APP_ROUTES, CALLBACK_URL_KEY } from "@/constants/routes";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { useCartStore } from "./use-cart-store";

export const useAddToCart = () => {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const pathname = usePathname();
  const _addOrUpdateItem = useCartStore((s) => s.addOrUpdateItem);
  const currentItems = useCartStore((s) => s.items);

  return useCallback(
    async (item: Omit<TCartItem, "quantity">, quantity: number) => {
      const existingItem = currentItems.find((i) => i.sku_id === item.sku_id);
      const previousQuantity = existingItem?.quantity || 0;
      const nextQuantity = previousQuantity + quantity;

      try {
        if (user) {
          _addOrUpdateItem(item, nextQuantity);

          const response = await cartUseCase.addItem.execute({
            sku_id: item.sku_id,
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
          toast.info("Please sign in to add items to cart");
        }
      } catch (err) {
        _addOrUpdateItem(item, previousQuantity);
        toast.error("Failed to add to cart");
      }
    },
    [currentItems, user, _addOrUpdateItem, pathname, router],
  );
};
