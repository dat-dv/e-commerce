import { INotification } from "@/domain/notifications/types/notification";
import { ApiListResponse } from "@/utils/request/request.types";

export interface TNotificationStoreState {
  loading: boolean;
  hasLoaded: boolean;
  unreadCount: number;
  readIds: Set<string>;
  isAllRead: boolean;
  data: ApiListResponse<INotification>;
}

export interface TNotificationStoreActions {
  setNotifications: (data: ApiListResponse<INotification>) => void;
  setLoading: (loading: boolean) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (data: ApiListResponse<INotification>) => void;
  reset: () => void;
  setUnreadCount: (count: number) => void;
  addReadId: (id: string) => void;
  setIsAllRead: (isAllRead: boolean) => void;
  resetReadStatus: () => void;
  appendNotifications: (data: ApiListResponse<INotification>) => void;
}

export type TNotificationStore = TNotificationStoreState &
  TNotificationStoreActions;
