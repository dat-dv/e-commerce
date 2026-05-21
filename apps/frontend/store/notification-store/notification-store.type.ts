import { INotification } from "@/domain/notifications/types/notification";

export interface TNotificationStoreState {
  notifications: INotification[];
  loading: boolean;
  hasLoaded: boolean;
  unreadCount: number;
  readIds: Set<string>;
  isAllRead: boolean;
}

export interface TNotificationStoreActions {
  setNotifications: (notifications: INotification[]) => void;
  setLoading: (loading: boolean) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: INotification) => void;
  reset: () => void;
  setUnreadCount: (count: number) => void;
  addReadId: (id: string) => void;
  setIsAllRead: (isAllRead: boolean) => void;
  resetReadStatus: () => void;
}

export type TNotificationStore = TNotificationStoreState &
  TNotificationStoreActions;
