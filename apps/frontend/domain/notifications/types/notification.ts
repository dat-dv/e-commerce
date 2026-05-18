import { ENotificationType } from "@ecommerce/shared";

import { JsonValue } from "@/utils/request/request.types";

export interface INotification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: ENotificationType;
  link?: string;
  isRead: boolean;
  metadata?: Record<string, JsonValue>;
  createdAt: string;
  updatedAt: string;
}
