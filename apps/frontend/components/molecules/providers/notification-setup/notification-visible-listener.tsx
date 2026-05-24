import { useUnreadCount } from "@/hooks/notifications/use-unread-count";
import { useVisibilityChange } from "@/hooks/utils/use-visibility-change";
import { useCallback } from "react";

const NotificationVisibleListener = () => {
  const { loadUnreadCount } = useUnreadCount();
  const onVisibleChange = useCallback(
    (isVisible: boolean) => {
      if (!isVisible) return;
      loadUnreadCount();
    },
    [loadUnreadCount],
  );

  useVisibilityChange(onVisibleChange);

  return null;
};

export default NotificationVisibleListener;
