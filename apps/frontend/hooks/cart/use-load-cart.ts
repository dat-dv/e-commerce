import { useCallback } from "react";
import { cartUseCase } from "@/domain/cart/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useCartStore } from "./use-cart-store";

export const useLoadCart = () => {
  const user = useAuthStore((s) => s.user);
  const setLoading = useCartStore((s) => s.setLoading);
  const setItems = useCartStore((s) => s.setItems);

  return useCallback(async () => {
    if (!user) return; // Guests rely on local storage (handled by Zustand persist)

    setLoading(true);
    try {
      const response = await cartUseCase.getCart.execute();
      if (response.data) {
        setItems(response.data.items);
      }
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, setItems]);
};
