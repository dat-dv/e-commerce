import type { NotificationToken, Notification } from "../generate/browser";
import type { IPaginatedResult } from "../paginate";

export type INotificationTokenResponse = NotificationToken;
export type INotificationResponse = Notification;
export type INotificationListResponse = IPaginatedResult<INotificationResponse>;
