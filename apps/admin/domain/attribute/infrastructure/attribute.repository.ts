import type { IApiResponse, IAttributeListResponse } from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { AdminProductMapper, type IAdminAttribute } from "@/domain/product";
import { apiClient } from "@/utils/request/api-client";

import type { IAdminAttributeRepository } from "../types/attribute.repository";

export class AdminAttributeRepository implements IAdminAttributeRepository {
  async getAttributes(): Promise<IApiResponse<IAdminAttribute[]>> {
    const response = await apiClient.get<IApiResponse<IAttributeListResponse>>(
      API_ROUTES.ATTRIBUTES.LIST,
    );

    return {
      ...response,
      data: AdminProductMapper.attributeListToDomain(response.data ?? []),
    };
  }
}
