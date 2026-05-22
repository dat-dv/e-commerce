import {
  ApiPaginatedResponse,
  ApiResponse,
} from "@/utils/request/request.types";
import {
  IGetNotificationsRequest,
  INotificationTokenResponse,
  INotificationUnreadCountResponse,
  ISaveTokenRequest,
} from "@ecommerce/shared";
import { INotification } from "./notification";

export type TSaveTokenRequest = ISaveTokenRequest;

export interface INotificationsRepository {
  saveToken(
    data: TSaveTokenRequest,
  ): Promise<ApiResponse<INotificationTokenResponse>>;
  getNotifications(
    query?: IGetNotificationsRequest,
  ): Promise<ApiPaginatedResponse<INotification>>;
  getUnreadCount(): Promise<ApiResponse<INotificationUnreadCountResponse>>;
  markAsRead(id: string): Promise<ApiResponse<INotification>>;
  markAllAsRead(): Promise<ApiResponse<void>>;
}
