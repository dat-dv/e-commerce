import type {
  IApiResponse,
  IBrandListResponse,
  IGetBrandListRequest,
} from "@ecommerce/shared";

export interface IAdminBrandRepository {
  getBrands(
    params?: IGetBrandListRequest,
  ): Promise<IApiResponse<IBrandListResponse>>;
}
