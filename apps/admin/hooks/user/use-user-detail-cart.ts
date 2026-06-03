import { useEffect, useState } from "react";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setCart(EMPTY_CART);
      setLoading(false);
      return;
    }

    let ignore = false;

    const loadData = async () => {
      setLoading(true);
      try {
        const cartResponse = await adminUserUseCase.getUserCart.execute(userId);
        if (!ignore) setCart(cartResponse);
      } catch (err) {
        if (!ignore) console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    void loadData();

    return () => {
      ignore = true;
    };
  }, [userId]);

  return { cart, loading };
};
