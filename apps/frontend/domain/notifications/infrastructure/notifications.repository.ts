import {
  ApiListResponse,
  ApiPaginatedResponse,
  ApiResponse,
  TRequest,
} from "@/utils/request/request.types";
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
import {
  createEmptyPaginatedData,
  mapPaginatedData,
} from "@/utils/request/pagination";

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

  async getNotifications(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<INotification>> {
    const response = await this.request.get<
      ApiListResponse<INotificationResponse> | INotificationResponse[]
    >(API_ROUTES.NOTIFICATIONS.BASE, { params });

    if (Array.isArray(response.data)) {
      return {
        ...response,
        data: {
          items: NotificationsMapper.toDomainList(response.data),
          meta: {
            total: response.data.length,
            page: params?.page || 1,
            limit: params?.limit || response.data.length || 10,
            totalPages: response.data.length > 0 ? 1 : 0,
          },
        },
      };
    }

    return {
      ...response,
      data: response.data
        ? mapPaginatedData(response.data, NotificationsMapper.toDomain, params)
        : createEmptyPaginatedData<INotification>(params),
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
