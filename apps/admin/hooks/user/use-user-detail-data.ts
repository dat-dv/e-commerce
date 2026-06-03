import { toast, useLoadOnce } from "@ecommerce/ui";
import { useCallback, useState } from "react";

import { adminPermissionUseCase } from "@/domain/permission";
import {
  adminUserUseCase,
  type IAdminRole,
  type IAdminUser,
  type IAdminUserAvatar,
} from "@/domain/user";

export const useUserDetailData = (userId: string | null) => {
  const [user, setUser] = useState<IAdminUser | null>(null);
  const [avatars, setAvatars] = useState<IAdminUserAvatar[]>([]);
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      toast.error("Missing user id.");
      return;
    }

    setLoading(true);

    try {
      const [userResponse, rolesResponse, avatarsResponse] = await Promise.all([
        adminUserUseCase.getUser.execute(userId),
        adminPermissionUseCase.getRoles.execute(),
        adminUserUseCase.getUserAvatars.execute(userId),
      ]);

      setUser(userResponse);
      setRoles(rolesResponse.items);
      setAvatars(avatarsResponse);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user details.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useLoadOnce(loadData, !!userId);

  return {
    user,
    avatars,
    roles,
    loading,
    setUser,
    setAvatars,
  };
};
