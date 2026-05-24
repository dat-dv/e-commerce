import { ENotificationClientEvent } from "@ecommerce/shared";

export type NotificationEventData = {
  type?: ENotificationClientEvent;
  id?: string;
  url?: string;
  orderId?: string;
  productId?: string;
  notificationId?: string;
  status?: string;
  title?: string;
  body?: string;
  [key: string]: string | undefined;
};

export interface NotificationListenerProps {
  userId: string;
  onNotificationChanged: (
    type: ENotificationClientEvent,
    data?: NotificationEventData,
  ) => void | Promise<void>;
}
