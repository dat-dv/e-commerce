import type { IApiResponse, IAttributeListResponse } from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/utils/request/api-client";

import type { IAdminAttributeRepository } from "../types/attribute.repository";

export class AdminAttributeRepository implements IAdminAttributeRepository {
  async getAttributes(): Promise<IApiResponse<IAttributeListResponse>> {
    return apiClient.get<IApiResponse<IAttributeListResponse>>(
      API_ROUTES.ATTRIBUTES.LIST,
    );
  }
}
