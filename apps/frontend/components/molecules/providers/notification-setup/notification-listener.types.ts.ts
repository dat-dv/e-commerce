import { ENotificationClientEvent } from "@ecommerce/shared";

export type ServiceWorkerPushMessageType = "push-received";

export type FirebaseNotificationPayload = {
  title?: string;
  body?: string;
};

export type FirebaseNotificationData = {
  type?: `${ENotificationClientEvent}`;
  orderId?: string;
  productId?: string;
  notificationId?: string;
  link?: string;
  url?: string;
  [key: string]: string | undefined;
};

export type FirebaseServiceWorkerMessagePayload = {
  data?: FirebaseNotificationData;
  from?: string;
  fcmMessageId?: string;
  notification?: FirebaseNotificationPayload;
  priority?: "normal" | "high" | string;
  isFirebaseMessaging?: boolean;
  messageType?: ServiceWorkerPushMessageType;
};

export interface NotificationListenerProps {
  userId: string;
  onNotificationChanged: (
    type: ENotificationClientEvent,
    data?: FirebaseServiceWorkerMessagePayload,
  ) => void | Promise<void>;
}
