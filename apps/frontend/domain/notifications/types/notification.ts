import { ENotificationType } from "@ecommerce/shared";

export interface INotification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: ENotificationType;
  link?: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
