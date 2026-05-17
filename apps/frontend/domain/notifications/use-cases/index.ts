import { appRequest } from "@/utils/request/request";
import { NotificationsRepository } from "../infrastructure/notifications.repository";
import { TSaveTokenRequest } from "../types/notifications.repository";

const notificationsRepository = new NotificationsRepository(appRequest);

export const notificationsUseCase = {
  saveToken: (data: TSaveTokenRequest) =>
    notificationsRepository.saveToken(data),
  getNotifications: (params?: { page?: number; limit?: number }) =>
    notificationsRepository.getNotifications(params),
  markAsRead: (id: string) => notificationsRepository.markAsRead(id),
  markAllAsRead: () => notificationsRepository.markAllAsRead(),
};
