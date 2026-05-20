import {
  ApiPaginatedResponse,
  ApiResponse,
} from "@/utils/request/request.types";
import {
  INotificationTokenResponse,
  INotificationUnreadCountResponse,
} from "@ecommerce/shared";
import { INotification } from "./notification";

export type TSaveTokenRequest = {
  token: string;
  deviceType?: string;
};

export interface INotificationsRepository {
  saveToken(
    data: TSaveTokenRequest,
  ): Promise<ApiResponse<INotificationTokenResponse>>;
  getNotifications(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<INotification>>;
  getUnreadCount(): Promise<ApiResponse<INotificationUnreadCountResponse>>;
  markAsRead(id: string): Promise<ApiResponse<INotification>>;
  markAllAsRead(): Promise<ApiResponse<void>>;
}
