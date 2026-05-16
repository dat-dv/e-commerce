import { ApiResponse, TRequest } from "@/utils/request/request.types";
import {
  INotificationTokenResponse,
  INotificationResponse,
} from "@ecommerce/shared";
import {
  INotificationsRepository,
  TSaveTokenRequest,
} from "../types/notifications.repository";

export class NotificationsRepository implements INotificationsRepository {
  constructor(private request: TRequest) {}

  async saveToken(
    data: TSaveTokenRequest,
  ): Promise<ApiResponse<INotificationTokenResponse>> {
    return this.request.post<INotificationTokenResponse>(
      "/notifications/tokens",
      data,
    );
  }

  async getNotifications(): Promise<ApiResponse<INotificationResponse[]>> {
    return this.request.get<INotificationResponse[]>("/notifications");
  }

  async markAsRead(id: string): Promise<ApiResponse<INotificationResponse>> {
    return this.request.patch<INotificationResponse>(
      `/notifications/${id}/read`,
    );
  }

  async markAllAsRead(): Promise<ApiResponse<void>> {
    return this.request.patch<void>("/notifications/read-all");
  }
}
