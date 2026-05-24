import { INotification } from "@/domain/notifications/types/notification";
import { ApiListResponse } from "@/utils/request/request.types";

export interface TNotificationStoreState {
  loading: boolean;
  hasLoaded: boolean;
  unreadCount: number;
  data: ApiListResponse<INotification>;
}

export interface TNotificationStoreActions {
  setNotifications: (data: ApiListResponse<INotification>) => void;
  setLoading: (loading: boolean) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  reset: () => void;
  setUnreadCount: (count: number) => void;
  appendNotifications: (data: ApiListResponse<INotification>) => void;
}

export type TNotificationStore = TNotificationStoreState &
  TNotificationStoreActions;
