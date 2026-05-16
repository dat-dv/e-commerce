import { INotification } from "@/domain/notifications/types/notification";

export interface TNotificationStoreState {
  notifications: INotification[];
  loading: boolean;
  hasLoaded: boolean;
}

export interface TNotificationStoreActions {
  setNotifications: (notifications: INotification[]) => void;
  setLoading: (loading: boolean) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: INotification) => void;
  reset: () => void;
}

export type TNotificationStore = TNotificationStoreState &
  TNotificationStoreActions;
