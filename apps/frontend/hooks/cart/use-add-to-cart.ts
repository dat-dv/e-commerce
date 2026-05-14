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
  const _addItem = useCartStore((s) => s.addItem);

  return useCallback(
    async (item: Omit<TCartItem, "quantity">, quantity: number) => {
      try {
        if (user) {
          const response = await cartUseCase.addItem.execute({
            sku_id: item.sku_id,
            quantity,
          });

          if (response.data) {
            _addItem(response.data, quantity);
            toast.success("Added to cart");
          }
        } else {
          const callbackUrl = encodeURIComponent(pathname);
          router.push(
            `${APP_ROUTES.SIGN_IN}?${CALLBACK_URL_KEY}=${callbackUrl}`,
          );
          toast.info("Please sign in to add items to cart");
        }
      } catch (err) {
        toast.error("Failed to add to cart");
        throw err;
      }
    },
    [user, _addItem, router, pathname],
  );
};
