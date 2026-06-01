import type { IOrderResponse } from "@ecommerce/shared";
import { useLoadOnce } from "@ecommerce/ui";
import { useCallback, useMemo, useState } from "react";

import { AdminOrderRepository } from "@/domain/order";
import {
  AdminPermissionRepository,
  type TAdminRole,
} from "@/domain/permission";
import {
  AdminUserRepository,
  type IAdminUser,
  type IAdminUserAvatar,
} from "@/domain/user";
import type { ApiListResponse } from "@/utils/request";

export const useUserDetailData = (userId: string | null) => {
  const userRepository = useMemo(() => new AdminUserRepository(), []);
  const permissionRepository = useMemo(
    () => new AdminPermissionRepository(),
    [],
  );
  const orderRepository = useMemo(() => new AdminOrderRepository(), []);

  const [user, setUser] = useState<IAdminUser | null>(null);
  const [avatars, setAvatars] = useState<IAdminUserAvatar[]>([]);
  const [orders, setOrders] = useState<ApiListResponse<IOrderResponse>>({
    items: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
  });
  const [roles, setRoles] = useState<TAdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      setError("Missing user id.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [userResponse, rolesResponse, avatarsResponse, ordersResponse] =
        await Promise.all([
          userRepository.getUser(userId),
          permissionRepository.getRoles(),
          userRepository.getUserAvatars(userId),
          orderRepository.getOrders(1, 10, { user_id: userId }),
        ]);

      setUser(userResponse);
      setRoles(rolesResponse.items);
      setAvatars(avatarsResponse);
      setOrders(
        ordersResponse.data || {
          items: [],
          meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
        },
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load user detail.");
    } finally {
      setLoading(false);
    }
  }, [userId, userRepository, permissionRepository, orderRepository]);

  useLoadOnce(loadData, !!userId);

  return {
    user,
    avatars,
    roles,
    orders,
    loading,
    error,
    setUser,
    setAvatars,
    setError,
  };
};
