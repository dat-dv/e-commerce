import { toast, useLoadOnce } from "@ecommerce/ui";
import { useCallback, useMemo, useState } from "react";

import {
  AdminPermissionRepository,
  type TAdminRole,
} from "@/domain/permission";
import {
  AdminUserRepository,
  type IAdminUser,
  type IAdminUserAvatar,
} from "@/domain/user";

export const useUserDetailData = (userId: string | null) => {
  const userRepository = useMemo(() => new AdminUserRepository(), []);
  const permissionRepository = useMemo(
    () => new AdminPermissionRepository(),
    [],
  );

  const [user, setUser] = useState<IAdminUser | null>(null);
  const [avatars, setAvatars] = useState<IAdminUserAvatar[]>([]);
  const [roles, setRoles] = useState<TAdminRole[]>([]);
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
        userRepository.getUser(userId),
        permissionRepository.getRoles(),
        userRepository.getUserAvatars(userId),
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
  }, [userId, userRepository, permissionRepository]);

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
