import { PUBLIC_ENV } from "@/config/public.env.config";
import { API_ROUTES } from "@/constants/routes";
import {
  ApiPaginatedResponse,
  ApiResponse,
  TRequest,
} from "@/utils/request/request.types";
import {
  IGetNotificationsRequest,
  INotificationListResponse,
  INotificationResponse,
  INotificationTokenResponse,
  INotificationUnreadCountResponse,
} from "@ecommerce/shared";
import { INotification } from "../types/notification";
import {
  INotificationsRepository,
  TSaveTokenRequest,
} from "../types/notifications.repository";
import { NotificationsMapper } from "./notifications.mapper";

const NOTIFICATION_REPOSITORY_LOG_PREFIX = "[notification-repository]";

const logNotificationRepository = (
  message: string,
  data?: Record<string, unknown>,
) => {
  if (!PUBLIC_ENV.IS_DEBUG) return;

  console.info(NOTIFICATION_REPOSITORY_LOG_PREFIX, message, {
    at: new Date().toISOString(),
    ...data,
  });
};

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

  async getNotifications(
    query?: IGetNotificationsRequest,
  ): Promise<ApiPaginatedResponse<INotification>> {
    logNotificationRepository("getNotifications request", { query });

    const response = await this.request.get<INotificationListResponse>(
      API_ROUTES.NOTIFICATIONS.BASE,
      { params: query },
    );

    logNotificationRepository("getNotifications response", {
      status: response.status,
      itemCount: response.data?.items?.length,
      total: response.data?.meta?.total,
      page: response.data?.meta?.page,
    });

    return {
      ...response,
      data: {
        meta: response.data.meta,
        items: response.data.items?.map(NotificationsMapper.toDomain) || [],
      },
    };
  }

  async getUnreadCount(): Promise<
    ApiResponse<INotificationUnreadCountResponse>
  > {
    logNotificationRepository("getUnreadCount request");

    const response = await this.request.get<INotificationUnreadCountResponse>(
      API_ROUTES.NOTIFICATIONS.UNREAD_COUNT,
    );

    logNotificationRepository("getUnreadCount response", {
      status: response.status,
      count: response.data?.count,
    });

    return response;
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
