import type { IGetBrandListRequest } from "@ecommerce/shared";

import type { IAdminBrand } from "@/domain/product";
import type { ApiListResponse } from "@/utils/request";

export interface IAdminBrandRepository {
  getBrands(
    params?: IGetBrandListRequest,
  ): Promise<ApiListResponse<IAdminBrand>>;
}
