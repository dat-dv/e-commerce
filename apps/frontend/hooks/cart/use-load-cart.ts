import { cartUseCase } from "@/domain/cart/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { RequestError } from "@/utils/request/request-creator";
import { useCallback } from "react";
import { useCartStore } from "./use-cart-store";

export const useLoadCart = () => {
  const user = useAuthStore((s) => s.user);
  const setLoading = useCartStore((s) => s.setLoading);
  const setItems = useCartStore((s) => s.setItems);
  const clearCart = useCartStore((s) => s.clearCart);

  return useCallback(async (): Promise<TCartItem[] | undefined> => {
    if (!user) return undefined;

    setLoading(true);
    try {
      const response = await cartUseCase.getCart.execute();
      if (response.data) {
        setItems(response.data.items);
        return response.data.items;
      }
    } catch (err) {
      if (err instanceof RequestError && err.data?.statusCode === 401) {
        clearCart();
        return [];
      }

      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, setItems, clearCart]);
};
