import {
  ApiPaginatedResponse,
  ApiResponse,
  TRequest,
} from "@/utils/request/request.types";
import {
  INotificationListResponse,
  INotificationTokenResponse,
  INotificationResponse,
  INotificationUnreadCountResponse,
} from "@ecommerce/shared";
import {
  INotificationsRepository,
  TSaveTokenRequest,
} from "../types/notifications.repository";
import { NotificationsMapper } from "./notifications.mapper";
import { API_ROUTES } from "@/constants/routes";
import { INotification } from "../types/notification";
import { mapPaginatedData } from "@/utils/request/pagination";

export class NotificationsRepository implements INotificationsRepository {
  constructor(private request: TRequest) {}

  async saveToken(
    data: TSaveTokenRequest,
  ): Promise<ApiResponse<INotificationTokenResponse>> {
    return this.request.post<INotificationTokenResponse>(
      API_ROUTES.NOTIFICATIONS.TOKENS,
      NotificationsMapper.toSaveTokenRequest(data),
    );
  }

  async getNotifications(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<INotification>> {
    const response = await this.request.get<INotificationListResponse>(
      API_ROUTES.NOTIFICATIONS.BASE,
      { params },
    );

    return {
      ...response,
      data: mapPaginatedData(response.data, NotificationsMapper.toDomain),
    };
  }

  async getUnreadCount(): Promise<
    ApiResponse<INotificationUnreadCountResponse>
  > {
    return this.request.get<INotificationUnreadCountResponse>(
      API_ROUTES.NOTIFICATIONS.UNREAD_COUNT,
    );
  }

  async markAsRead(id: string): Promise<ApiResponse<INotification>> {
    const response = await this.request.patch<INotificationResponse>(
      API_ROUTES.NOTIFICATIONS.MARK_AS_READ(id),
    );

    return {
      ...response,
      data: NotificationsMapper.toDomain(response.data!),
    };
  }

  async markAllAsRead(): Promise<ApiResponse<void>> {
    return this.request.patch<void>(API_ROUTES.NOTIFICATIONS.MARK_ALL_AS_READ);
  }
}
