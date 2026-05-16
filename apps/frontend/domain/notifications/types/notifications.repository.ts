import { ApiResponse } from "@/utils/request/request.types";
import {
  INotificationTokenResponse,
  INotificationResponse,
} from "@ecommerce/shared";

export type TSaveTokenRequest = {
  token: string;
  device_type?: string;
};

export interface INotificationsRepository {
  saveToken(
    data: TSaveTokenRequest,
  ): Promise<ApiResponse<INotificationTokenResponse>>;
  getNotifications(): Promise<ApiResponse<INotificationResponse[]>>;
  markAsRead(id: string): Promise<ApiResponse<INotificationResponse>>;
  markAllAsRead(): Promise<ApiResponse<void>>;
}
