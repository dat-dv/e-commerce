import { toast } from "@ecommerce/ui";
import { useEffect, useState, useTransition } from "react";

import { adminUserUseCase, type IAdminCustomerCart } from "@/domain/user";

const EMPTY_CART: IAdminCustomerCart = {
  id: "",
  userId: "",
  createdAt: "",
  updatedAt: "",
  items: [],
};

export const useUserDetailCart = (userId: string | null) => {
  const [cart, setCart] = useState<IAdminCustomerCart>(EMPTY_CART);
  const [loading, startLoadingTransition] = useTransition();

  useEffect(() => {
    if (!userId) {
      setCart(EMPTY_CART);
      return;
    }

    startLoadingTransition(async () => {
      try {
        const cartResponse = await adminUserUseCase.getUserCart.execute(userId);
        setCart(cartResponse);
      } catch {
        toast.error("Failed to load customer cart.");
      }
    });
  }, [userId]);

  return { cart, loading };
};
