import { useEffect, useMemo, useState } from "react";

import {
  AdminUserRepository,
  type IAdminCustomerActivityItem,
} from "@/domain/user";

export const useUserDetailActivity = (userId: string | null) => {
  const userRepository = useMemo(() => new AdminUserRepository(), []);
  const [activities, setActivities] = useState<IAdminCustomerActivityItem[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setActivities([]);
      setLoading(false);
      return;
    }

    let ignore = false;

    const loadData = async () => {
      setLoading(true);
      try {
        const activityResponse = await userRepository.getUserActivity(userId);
        if (!ignore) setActivities(activityResponse);
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

  return { activities, loading };
};
