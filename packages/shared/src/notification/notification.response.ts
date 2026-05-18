import type { NotificationToken, Notification } from "../generate/browser";
import type { IPaginatedResult } from "../paginate";

export type NotificationMetadataValue =
  | string
  | number
  | boolean
  | null
  | NotificationMetadataValue[]
  | { [key: string]: NotificationMetadataValue };

export type NotificationMetadata = Record<string, NotificationMetadataValue>;

export type INotificationTokenResponse = NotificationToken;
export type INotificationResponse = Omit<Notification, "metadata"> & {
  metadata: NotificationMetadata | null;
};
export type INotificationListResponse = IPaginatedResult<INotificationResponse>;
