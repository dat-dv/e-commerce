import { ENotificationType, NotificationMetadata } from "@ecommerce/shared";

export interface INotification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: ENotificationType;
  link?: string;
  isRead: boolean;
  metadata?: NotificationMetadata;
  createdAt: string;
  updatedAt: string;
}
