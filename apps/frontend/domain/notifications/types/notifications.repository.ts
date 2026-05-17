import {
  ApiPaginatedResponse,
  ApiResponse,
} from "@/utils/request/request.types";
import { INotificationTokenResponse } from "@ecommerce/shared";
import { INotification } from "./notification";

export type TSaveTokenRequest = {
  token: string;
  device_type?: string;
};

export interface INotificationsRepository {
  saveToken(
    data: TSaveTokenRequest,
  ): Promise<ApiResponse<INotificationTokenResponse>>;
  getNotifications(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<INotification>>;
  markAsRead(id: string): Promise<ApiResponse<INotification>>;
  markAllAsRead(): Promise<ApiResponse<void>>;
}
