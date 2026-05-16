import { ApiResponse, TRequest } from "@/utils/request/request.types";
import {
  INotificationTokenResponse,
  INotificationResponse,
} from "@ecommerce/shared";
import {
  INotificationsRepository,
  TSaveTokenRequest,
} from "../types/notifications.repository";
import { NotificationsMapper } from "./notifications.mapper";
import { API_ROUTES } from "@/constants/routes";
import { INotification } from "../types/notification";

export class NotificationsRepository implements INotificationsRepository {
  constructor(private request: TRequest) {}

  async saveToken(
    data: TSaveTokenRequest,
  ): Promise<ApiResponse<INotificationTokenResponse>> {
    return this.request.post<INotificationTokenResponse>(
      API_ROUTES.NOTIFICATIONS.TOKENS,
      data,
    );
  }

  async getNotifications(): Promise<ApiResponse<INotification[]>> {
    const response = await this.request.get<INotificationResponse[]>(
      API_ROUTES.NOTIFICATIONS.BASE,
    );

    return {
      ...response,
      data: response.data
        ? NotificationsMapper.toDomainList(response.data)
        : [],
    };
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
