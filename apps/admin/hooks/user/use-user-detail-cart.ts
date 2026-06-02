import { useEffect, useMemo, useState } from "react";

import { AdminUserRepository, type IAdminCustomerCart } from "@/domain/user";

const EMPTY_CART: IAdminCustomerCart = {
  id: "",
  createdAt: "",
  updatedAt: "",
  items: [],
  totalItems: 0,
  subtotal: 0,
};

export const useUserDetailCart = (userId: string | null) => {
  const userRepository = useMemo(() => new AdminUserRepository(), []);
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
        const cartResponse = await userRepository.getUserCart(userId);
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
  }, [userId, userRepository]);

  return { cart, loading };
};
